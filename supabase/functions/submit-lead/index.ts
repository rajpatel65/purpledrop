import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KNOWN_FORMS = ['contact', 'scorecard', 'calculator', 'soc2-fallback'] as const;
type KnownForm = typeof KNOWN_FORMS[number];

// Where leads are delivered: purpledrop's public inbox, which forwards to the
// owner via Cloudflare Email Routing. Raj directed delivery here (Nov 17 2026).
const LEAD_INBOX = 'info@purpledrop.com';

const FORM_LABELS: Record<KnownForm, string> = {
  contact: 'Free call request (contact page)',
  scorecard: 'Security Scorecard request',
  calculator: 'AI Visibility Calculator results',
  'soc2-fallback': 'SOC2 assessment (fallback capture)',
};

// Friendlier labels for known fields; anything else falls back to a
// humanized version of its key.
const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  business: 'Business',
  website: 'Website',
  domain: 'Website',
  goal: 'Goal',
  message: 'Message',
  preferred_time: 'Preferred time',
};

// Fields that are metadata or never shown, not lead content.
const SKIP_KEYS = new Set(['form', 'type', '_honey', 'honeypot', '_subject', 'challenge_id', 'verification_token']);

// Payload guardrails.
const MAX_BODY_BYTES = 16 * 1024;

// Basic per-IP rate limiting. In-memory: counters live inside one Deno
// isolate, reset on redeploy or restart, and are not shared across isolates.
// A speed bump against casual abuse, not a hard quota.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') || '';
  return fwd.split(',')[0].trim() || 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (times.length >= RATE_LIMIT_MAX) {
    hits.set(ip, times);
    return true;
  }
  times.push(now);
  hits.set(ip, times);
  if (hits.size > 1000) {
    for (const [key, arr] of hits) {
      if (arr.length === 0 || now - arr[arr.length - 1] > RATE_LIMIT_WINDOW_MS) hits.delete(key);
    }
  }
  return false;
}

async function digest(value: string): Promise<string> {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Call a Postgres RPC with the service role (same pattern the scorecard flow uses).
async function rpc(fn: string, args: Record<string, unknown>) {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const res = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error('Database unavailable');
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clean(value: unknown, max = 2000): string {
  if (value === null || value === undefined) return '';
  return String(value).trim().slice(0, max);
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

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // In-memory limiter runs before any verification token is consumed, so a
  // rate-limited retry never burns a valid token.
  if (rateLimited(clientIp(req))) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again in a few minutes.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const declaredLength = Number(req.headers.get('content-length') || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: 'Payload too large' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: 'Payload too large' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let body: any;
    try {
      body = JSON.parse(raw);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Honeypot: bots fill hidden fields; humans never do. Accept silently so
    // bots learn nothing, but send nothing. The static site uses `honeypot`;
    // older forms used `_honey`.
    if (clean(body._honey) || clean(body.honeypot)) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // The current contact form posts no form/type discriminator; treat a
    // missing one as the contact form (the only public lead form).
    const rawForm = clean(body.form || body.type, 40).toLowerCase();
    const form = (rawForm || 'contact') as KnownForm;
    if (!KNOWN_FORMS.includes(form)) {
      return new Response(JSON.stringify({ error: 'Unknown form' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (form === 'scorecard') return new Response(JSON.stringify({ error: 'Email verification is required. Please use the scorecard page.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const email = clean(body.email, 254).toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Per-form required fields beyond email.
    if (form === 'contact' && !clean(body.name, 120)) {
      return new Response(JSON.stringify({ error: 'Name required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Server-side enforcement for the contact form: the request is accepted
    // only with a fresh, single-use verification token issued by verify-code
    // after the visitor enters the code emailed to them. All field validation
    // above runs first so a bad payload never burns a valid token.
    if (form === 'contact') {
      const challengeId = clean(body.challenge_id, 40);
      const token = typeof body.verification_token === 'string' ? body.verification_token : '';
      if (!UUID_RE.test(challengeId) || token.length !== 72) {
        return new Response(JSON.stringify({ error: 'Verify your email before sending: request a code and enter it.' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const ip = await digest(clientIp(req));
      let source: any = null;
      try {
        source = await rpc('consume_scorecard_token', { challenge: challengeId, token: await digest(token), source_ip: ip });
      } catch (e) {
        console.error('consume_scorecard_token failed:', e);
        return new Response(JSON.stringify({ error: 'Verification check failed. Please try again.' }), {
          status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (Array.isArray(source)) source = source[0] || null;
      if (!source || !source.email) {
        return new Response(JSON.stringify({ error: 'Verification expired or already used. Request a fresh code.' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (String(source.email).toLowerCase() !== email) {
        return new Response(JSON.stringify({ error: 'The verified email does not match the email on this request.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const rows = Object.keys(body)
      .filter((key) => !SKIP_KEYS.has(key) && clean(body[key]))
      .map((key) => {
        const fallback = key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const label = esc(FIELD_LABELS[key] || fallback);
        return `<tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e0d8; color: #666; font-size: 13px; vertical-align: top; white-space: nowrap;">${label}</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e0d8; color: #1a1a1a; font-size: 14px;">${esc(clean(body[key])).replace(/\n/g, '<br>')}</td>
        </tr>`;
      })
      .join('\n');

    const verifiedRow = form === 'contact'
      ? `<tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e0d8; color: #666; font-size: 13px; vertical-align: top; white-space: nowrap;">Email verified</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e0d8; color: #1a1a1a; font-size: 14px;">Yes, one-time code</td>
        </tr>`
      : '';

    const name = clean(body.name, 120);
    const subjectDetail = form === 'contact' && name
      ? name
      : form === 'scorecard'
        ? clean(body.domain, 254)
        : email;

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Lead delivery is not configured. Please try again later.' }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'purpleDrop Leads <security@purpledrop.com>',
        to: [LEAD_INBOX],
        reply_to: email,
        subject: `[purpleDrop] ${FORM_LABELS[form]}: ${subjectDetail}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
            <h1 style="font-size: 20px; color: #1a1a1a; margin: 0 0 4px;">New lead: ${esc(FORM_LABELS[form])}</h1>
            <p style="color: #888; font-size: 13px; margin: 0 0 20px;">Submitted ${esc(new Date().toISOString())} via purpledrop.com &middot; reply goes straight to the sender</p>
            <table style="border-collapse: collapse; width: 100%; border: 1px solid #e5e0d8;">
              ${rows}
              ${verifiedRow}
            </table>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Could not send. Please try again or email info@purpledrop.com directly.' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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
