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
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

// Escalating ban: once an address shows sustained brute-force behavior in
// verify-code, stop serving codes to it entirely. Attacks don't get new
// codes to work on; honest users are untouched because correct codes are
// never refused and they never rack up failures.
const BLOCK_WINDOW_MS = 60 * 60 * 1000; // look back 1 hour
const BLOCK_THRESHOLD = 20; // 20+ failed guesses = deliberate attack, not typos

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
    try {
      const raw = await req.text(); if (raw.length > 4096) return new Response('Request too large', {status:413,headers:corsHeaders}); body = JSON.parse(raw);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (body.purpose === 'scorecard') {
      if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });
      return await scorecardFlow(req, body, corsHeaders, 'request');
    }
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';

    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Suppress emails to known attack sources — don't feed brute-force new codes
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const blockWindowStart = new Date(Date.now() - BLOCK_WINDOW_MS).toISOString();
    const { count: failCount } = await supabaseAdmin
      .from('verification_codes')
      .select('id', { count: 'exact', head: true })
      .eq('email', 'attempt:' + normalizedEmail)
      .gte('created_at', blockWindowStart);

    if ((failCount ?? 0) >= BLOCK_THRESHOLD) {
      return new Response(JSON.stringify({ error: 'This email is temporarily blocked. If this is your address and you did not request this, contact security@purpledrop.com.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Email delivery is not configured. Please try again later.' }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rejection sampling avoids modulo bias in the six-digit code.
    const random = new Uint32Array(1);
    do { crypto.getRandomValues(random); } while (random[0] >= 4294800000);
    const code = (100000 + random[0] % 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Rate limit: max 3 codes per hour per email
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count: recentCount } = await supabaseAdmin
      .from('verification_codes')
      .select('id', { count: 'exact', head: true })
      .eq('email', normalizedEmail)
      .gte('created_at', oneHourAgo);
    if ((recentCount ?? 0) >= RATE_LIMIT_MAX) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please wait an hour.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store verification code
    const { error: insertError } = await supabaseAdmin
      .from('verification_codes')
      .insert({
        email: normalizedEmail,
        code,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to store code' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send email via Resend (or your preferred provider)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'purpleDrop Security <security@purpledrop.com>',
        to: [normalizedEmail],
        subject: 'Your purpleDrop SOC2 Assessment Verification Code',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: #1a1a2e; border-radius: 12px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 16px; font-size: 24px;">purpleDrop Security Assessment</h1>
              <p style="color: #aaa; margin: 0 0 24px; font-size: 16px;">Your verification code</p>
              <div style="background: #0f0f1a; border-radius: 8px; padding: 24px; margin: 0 0 24px;">
                <span style="font-family: 'SF Mono', 'Monaco', monospace; font-size: 32px; letter-spacing: 8px; color: #fff; font-weight: 600;">${code}</span>
              </div>
              <p style="color: #666; font-size: 14px; margin: 0;">Expires in 10 minutes. If you didn't request this, please ignore.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend error:', error);
      await supabaseAdmin.from('verification_codes').update({ used: true }).eq('email', normalizedEmail).eq('code', code);
      return new Response(JSON.stringify({ error: 'Could not send the verification email. Please try again later.' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Verification code sent' }), {
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
