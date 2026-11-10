import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = ['https://purpledrop.com', 'https://www.purpledrop.com', 'https://purpledrop-newsite.pages.dev', 'http://localhost:3000', 'http://localhost:5173'];
function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

// Origin gate: real browsers always send Origin on cross-origin requests. Calls
// without an allowed origin (direct scripts, tools) are rejected before any
// logic runs. Not a security wall — a cheap speed bump ahead of the JWT check.
function originAllowed(req: Request): boolean {
  return ALLOWED_ORIGINS.includes(req.headers.get('Origin') || '');
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!originAllowed(req)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user via JWT
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id;

    if (req.method === 'POST') {
      // Save progress or complete assessment
      let body: any;
      try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
      const { sessionId, answers, currentSection, status } = body;

      if (!answers || typeof answers !== 'object' || Object.keys(answers).length > 100) {
        return new Response(JSON.stringify({ error: 'Answers required (max 100)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (currentSection && typeof currentSection !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid section' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (status && !['started','in_progress','completed','abandoned'].includes(status)) {
        return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Identify new lead signals (no/dont_know answers)
      const leadSignals = [];
      for (const [questionId, answer] of Object.entries(answers)) {
        if (answer === 'no' || answer === 'dont_know') {
          // We'd need question metadata - for now store what we have
          leadSignals.push({
            session_id: sessionId,
            question_id: questionId,
            answer,
            section: currentSection,
            criterion: 'unknown', // Would need question lookup
          });
        }
      }

      const updateData: any = {
        answers,
        updated_at: new Date().toISOString(),
      };

      if (currentSection) updateData.current_section = currentSection;
      if (status) updateData.status = status;
      if (status === 'completed') updateData.completed_at = new Date().toISOString();

      const { data: session, error: sessionError } = await supabaseAdmin
        .from('assessment_sessions')
        .upsert({
          id: sessionId || undefined,
          user_id: userId,
          email: user.email,
          ...updateData,
        }, { onConflict: 'id' })
        .select()
        .single();

      if (sessionError) {
        console.error('Session error:', sessionError);
        return new Response(JSON.stringify({ error: 'Failed to save' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Store lead signals
      if (leadSignals.length > 0 && session) {
        await supabaseAdmin.from('lead_signals').insert(leadSignals);
      }

      // Update profile last_assessment_at
      await supabaseAdmin
        .from('profiles')
        .update({ last_assessment_at: new Date().toISOString() })
        .eq('id', userId);

      return new Response(JSON.stringify({ success: true, session }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      // Get session or list sessions
      const url = new URL(req.url);
      const sessionId = url.searchParams.get('sessionId');

      if (sessionId) {
        const { data: session, error } = await supabaseAdmin
          .from('assessment_sessions')
          .select('*, lead_signals(*)')
          .eq('id', sessionId)
          .eq('user_id', userId)
          .single();

        if (error) {
          return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ session }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // List user's sessions
      const { data: sessions, error } = await supabaseAdmin
        .from('assessment_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return new Response(JSON.stringify({ sessions }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
