# Public scorecard

The public flow is email + domain + consent, Turnstile (when configured), email code, verification, then one scan. No report is emailed to the visitor. The six categories remain HTTPS trust, security headers, public email authentication, homepage response cookies, HTTPS redirects/static HTTP references, and public DNS.

Results are returned once with `Cache-Control: no-store`. There is no saved-report endpoint. The frontend keeps results only in React memory and clears them after 10 minutes, on page hide/tab switching, or on navigation. Copying, screenshots and the visitor's own developer tools cannot be prevented after data is displayed.

## Deployment

1. Apply both SQL files in `supabase/migrations/` in filename order.
2. Deploy `send-verification`, `verify-code`, `website-scorecard` and `submit-lead`. Their scorecard branches do not change the SOC2 code path. Direct old-style scorecard lead submissions are rejected so the new verification gate cannot be bypassed to send lead emails.
3. Build Pages from main. The public `VITE_TURNSTILE_SITE_KEY` is in `wrangler.toml`; the existing Supabase build variables must remain present.
4. Set `TURNSTILE_SECRET_KEY` only in Supabase Edge Function secrets. Never put it in a Vite variable or commit. Once set, code requests without a valid Turnstile token, correct action and approved hostname fail closed.

The existing `RESEND_API_KEY`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` stay server-side.

## Abuse controls

- Atomic, persistent rate limits. Code requests: 3/email/hour, 5/source/hour, 50 total/day. Verification requests: 30/source/15 minutes, 500 total/day. Scans: 3/email/day, 5/domain/hour, 10/source/hour, 100 total/day.
- Three incorrect guesses lock that challenge and block fresh code requests for its email and source for 15 minutes. A correct fourth guess is rejected too. Requests and guesses do not create fresh windows.
- Hashed codes and random single-use scan tokens. Ten-minute expiry. Atomic token consumption rejects replay and parallel reuse. Tokens are never stored in browser storage or URLs.
- Host validation rejects credentials, ports, local domains and IP literals. Every redirect is validated. DNS from the public and runtime resolver is checked for private/reserved addresses before requests. Response body size, redirect depth and network time are bounded.
- CORS/origin checks are an extra browser gate, not authentication. Rate limits are a backstop, not a guarantee against denial of service. Source-address controls depend on the ingress proxy's forwarded-address handling. Turnstile is required for the intended public anti-bot layer.
- Challenge records contain email/domain and hashed source/code/token. Results are never stored. Day-old challenge rows are deleted on later code requests; rate buckets expire and are cleaned during later claims.

## Measurement limits

This is an outside-in homepage response and DNS check, not a penetration test or SOC2 certification. HTTPS client validation does not inspect certificate expiry or every TLS version/cipher. DKIM cannot be declared absent without a known selector or real sent message. Header presence does not prove a safe policy. JavaScript/consent/login cookies and runtime resource requests are not observed. CAA is optional and non-mail domains may not need MX. Unknown is not a failure.

## Tests

Use Deno 2: `deno test --allow-env supabase/functions/tests/scorecard_test.ts` (an isolated Deno config avoids resolving the site's npm tree). Run `npm ci && npm run build` for the frontend. Do not send QA emails to prospects; use only the owner's approved test inbox.

`_shared/report-pdf.ts` is a local-tool building block, not imported by any public function. `scripts/preview-scorecard.ts` generates a local preview only; it sends no email.
