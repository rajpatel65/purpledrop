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
const KNOWN_FORMS = ['contact', 'scorecard', 'calculator', 'soc2-fallback'] as const;
type KnownForm = typeof KNOWN_FORMS[number];

// Where leads are delivered. purpledrop.com has no inbox yet; Raj approved
// delivery to his Gmail until a purpledrop.com mailbox exists.
const LEAD_INBOX = 'rpatel7@gmail.com';

const FORM_LABELS: Record<KnownForm, string> = {
  contact: 'Free call request (contact page)',
  scorecard: 'Security Scorecard request',
  calculator: 'AI Visibility Calculator results',
  'soc2-fallback': 'SOC2 assessment (fallback capture)',
};

// Fields that are metadata or never shown, not lead content.
const SKIP_KEYS = new Set(['form', 'type', '_honey', '_subject']);

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

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Honeypot: bots fill hidden fields; humans never do. Accept silently so
    // bots learn nothing, but send nothing.
    if (clean(body._honey)) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const form = clean(body.form || body.type, 40).toLowerCase() as KnownForm;
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
    if (form === 'scorecard' && !clean(body.domain, 254)) {
      return new Response(JSON.stringify({ error: 'Website URL required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rows = Object.keys(body)
      .filter((key) => !SKIP_KEYS.has(key) && clean(body[key]))
      .map((key) => {
        const label = esc(key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
        return `<tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e0d8; color: #666; font-size: 13px; vertical-align: top; white-space: nowrap;">${label}</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e0d8; color: #1a1a1a; font-size: 14px;">${esc(clean(body[key])).replace(/\n/g, '<br>')}</td>
        </tr>`;
      })
      .join('\n');

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
