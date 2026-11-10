# Deployment and email verification checks

## Cloudflare Pages

Use the existing Pages project `purpledrop-newsite`, production branch `main`,
build command `npm run build`, output `dist`, and Node 22 or newer.
The CLI deploy scripts use the same project name as `wrangler.toml`.
This is a Pages project, not a Workers Sites project.

Routes are prerendered as separate HTML files. Do not add a global rewrite to
`/index.html`; unknown routes use the generated `404.html`.

Set these public build-time variables in Pages, then rebuild:

- `VITE_SUPABASE_URL`: the actual Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: the project's public anon key, never a service-role key
- `VITE_SUPABASE_FUNCTIONS_URL`: optional override, otherwise derived from the URL

A missing backend configuration now shows an error instead of claiming to send
an email. Local-only demo verification requires `VITE_SOC2_DEMO_MODE=true` in
Vite development mode. It is disabled in production.

## Supabase and email

1. Apply `supabase/schema.sql` to a new project. For an existing project,
   check which objects already exist rather than blindly rerunning the file.
2. Deploy `send-verification`, `verify-code`, and `assessment` with the Supabase
   CLI from this repo. `supabase/config.toml` explicitly disables the JWT gateway
   check on the two pre-login endpoints; the assessment endpoint still requires
   a signed-in user. Function code changes are NOT deployed by Cloudflare.
3. Set `RESEND_API_KEY` in Supabase Edge Function secrets, not Cloudflare or any
   `VITE_` variable. Verify `purpledrop.com` in Resend and authorize the sender
   `security@purpledrop.com`. Never commit a real API key.
4. Enable email authentication in Supabase Auth. The custom code flow uses
   Supabase Auth's admin generateLink and token exchange to create a real session
   after successful verification; it does not send a second email through Auth.
5. Test from `https://purpledrop.com`, `https://www.purpledrop.com`, or
   `https://purpledrop-newsite.pages.dev`. Branch-preview origins are deliberately
   not allowed by default. Add only a specific required preview origin to each
   function's allowlist if needed, then redeploy.
6. Use a test inbox you control: request a code, confirm it arrives, verify it,
   answer a question, refresh, and confirm the authenticated assessment saves.
   Check Supabase function logs and Resend delivery events if it does not arrive.

## Local regression checks

```sh
npm ci
npm run build
node scripts/test-soc2-client.mjs
npm run test:functions # requires Deno
npx wrangler pages dev dist
```

The function tests use an in-memory Supabase stub and mocked email provider.
They are not proof of production database setup, Auth configuration, actual
email delivery, or Cloudflare deployment. Those need the real accounts and an
end-to-end inbox test.
