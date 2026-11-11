import { scorecardFlow } from '../_shared/scorecard-flow.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = ['https://purpledrop.com', 'https://www.purpledrop.com', 'https://purpledrop.pages.dev', 'https://purpledrop-newsite.pages.dev', 'http://localhost:3000', 'http://localhost:5173'];
function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Origin gate: real browsers always send Origin on cross-origin POSTs. Calls
// without an allowed origin (direct scripts, tools) are rejected before any
// logic runs. Not a security wall — a cheap speed bump ahead of rate limits.
function originAllowed(req: Request): boolean {
  return ALLOWED_ORIGINS.includes(req.headers.get('Origin') || '');
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Brute-force guard: track failed verification attempts per email in the
// existing verification_codes table (prefix the email so attempt rows can
// never match a real code lookup — their expires_at is in the past).
const FAIL_PREFIX = 'attempt:';
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const ATTEMPT_MAX = 10;

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
    let body: any;
    try { const raw = await req.text(); if (raw.length > 4096) return new Response('Request too large', {status:413,headers:corsHeaders}); body = JSON.parse(raw); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
    if (body.purpose === 'scorecard') {
      if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });
      return await scorecardFlow(req, body, corsHeaders, 'verify');
    }
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
    const code = typeof body.code === 'string' ? body.code.trim().slice(0, 10) : '';

    if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(code)) {
      return new Response(JSON.stringify({ error: 'Email and 6-digit code required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = code.trim();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find valid, unused code FIRST — a correct code is proof of inbox access,
    // so it must never be refused, even if this email is under attack.
    const { data: verification, error: findError } = await supabaseAdmin
      .from('verification_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('code', normalizedCode)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (findError || !verification) {
      // Brute-force guard: flat-out refuse once we know this is an attack
      const attemptWindowStart = new Date(Date.now() - ATTEMPT_WINDOW_MS).toISOString();
      const { count: attemptCount } = await supabaseAdmin
        .from('verification_codes')
        .select('id', { count: 'exact', head: true })
        .eq('email', FAIL_PREFIX + normalizedEmail)
        .gte('created_at', attemptWindowStart);

      if ((attemptCount ?? 0) >= ATTEMPT_MAX) {
        // Known brute-force source: no feedback about codes, nothing to learn from
        return new Response(JSON.stringify({ error: 'Too many attempts. Try again later or request a new code.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Record the failed attempt for the escalating ban in send-verification
      await supabaseAdmin
        .from('verification_codes')
        .insert({
          email: FAIL_PREFIX + normalizedEmail,
          code: 'attempt',
          expires_at: new Date(Date.now() - 1000).toISOString(), // in the past: never matchable
        });

      return new Response(JSON.stringify({ error: 'Invalid or expired code' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Atomically consume the code so concurrent requests cannot replay it.
    const { data: consumed, error: consumeError } = await supabaseAdmin
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verification.id)
      .eq('used', false)
      .select('id')
      .single();
    if (consumeError || !consumed) {
      return new Response(JSON.stringify({ error: 'Code already used. Please request a new code.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Issue a real Supabase Auth session after proving inbox access. No second
    // email is sent: generateLink is for delivery via a custom provider.
    const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink', email: normalizedEmail,
    });
    if (linkError || !link?.properties?.hashed_token || !link.user) {
      throw new Error('Could not create auth identity');
    }
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: link.user.id, email: normalizedEmail, email_verified: true,
    }, { onConflict: 'email' });
    if (profileError) throw new Error('Could not save verified profile');

    const { data: authData, error: authError } = await supabaseAdmin.auth.verifyOtp({
      token_hash: link.properties.hashed_token, type: 'email',
    });
    if (authError || !authData.session) throw new Error('Could not create auth session');

    return new Response(JSON.stringify({
      success: true, email: normalizedEmail, verified: true,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    }), {
      status: 200,
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
