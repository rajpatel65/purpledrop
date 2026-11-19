# purpledrop.com

Static site for purpledrop.com ("By Design"), hosted on Cloudflare Pages.

- The site is plain static HTML/CSS/JS at the repo root (no build step). Pages build settings: no build command, output directory `/`.
- Deploy: push to `main` and Cloudflare Pages publishes it.
- `supabase/functions/` holds the Edge Function sources deployed to the purpledrop Supabase project (contact form lead intake, scorecard code flow). Deployed entry points were synced from the dashboard on Nov 18 2026; `_shared/` modules are the repo copies.
- Contact form: Turnstile check -> Supabase `submit-lead` -> Resend -> info@purpledrop.com.

Replaced the previous Vite/React source build on Nov 18 2026; that source remains in git history.
