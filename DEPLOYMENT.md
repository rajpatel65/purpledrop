# purpleDrop — Deployment Checklist

Everything needed to go from this folder to purpledrop.com live. Check items as done.

---

## 1. GitHub upload (repo: `purpledrop`, private)

Upload from `New_Site/` — **9 files + 4 folders**:

- [ ] `index.html`, `package.json`, `package-lock.json`, `postcss.config.js`
- [ ] `tailwind.config.js`, `tsconfig.json`, `vite.config.ts`, `wrangler.toml`, `CONTENT.md`
- [ ] `public/` — must include the hidden `.well-known/` folder (press **⌘⇧.** in Finder before dragging)
- [ ] `src/`, `scripts/`, `supabase/` (functions deploy separately — see §3)
- [ ] **NEVER upload** `node_modules/` or `dist/` (regenerated on every Cloudflare build)
- [ ] Verify in the GitHub UI: `public/.well-known/purpledrop.txt` exists — **the build fails without it**

## 2. Cloudflare Pages project (connect the repo)

- [ ] Workers & Pages → Create → Pages → Connect to Git → select `purpledrop`
- [ ] **Build command:** `npm run build`
- [ ] **Build output directory:** `dist`
- [ ] **Production branch:** `main`
- [ ] Custom domain: `purpledrop.com` (DNS already pointed)

### Environment variables (Pages → Settings → Environment variables)

| Name | Value | Where it comes from |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | anon/publishable key | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_FUNCTIONS_URL` | `https://<project-ref>.supabase.co/functions/v1` | same project ref |

> ⚠️ **RESEND_API_KEY does NOT go here.** It is server-only and lives in the
> Supabase function secrets (§3). Never put a Resend key in a `VITE_` variable —
> Vite bakes those into the public JavaScript bundle.

## 3. Supabase setup (the SOC2 backend)

- [ ] Create the Supabase project (region close to US buyers)
- [ ] SQL Editor → run `supabase/schema.sql` (creates profiles, assessment_sessions,
      lead_signals, verification_codes + RLS)
- [ ] Deploy the three edge functions:

  ```sh
  supabase functions deploy send-verification
  supabase functions deploy verify-code
  supabase functions deploy assessment
  ```

- [ ] Function secrets (Supabase dashboard → Edge Functions → Secrets, or CLI
      `supabase secrets set`): set `RESEND_API_KEY` (`re_…` from resend.com)
- [ ] Confirm `RESEND` domain/sender: emails send from `security@purpledrop.com`
      — add the domain in Resend and verify DNS records
- [ ] **Verify the origin gate deployed:** run
      `curl -X POST https://<ref>.supabase.co/functions/v1/verify-code -d '{}'`
      → expect `403 Forbidden` (no Origin header = blocked)
- [ ] **Verify email delivery:** complete the SOC2 flow end-to-end with a real
      email — the 6-digit code email must arrive within ~1 min

> ⚠️ The Cloudflare Pages build only ships the static site. The functions above
> are separate and must be deployed with the Supabase CLI (any code change to
> `supabase/functions/*` requires a re-deploy).

> ℹ️ If the `VITE_SUPABASE_*` vars are missing, the site still works in
> "fallback capture" mode: the assessment completes and the lead is relayed to
> the shared Formspree inbox — never silent. But set the vars properly so users
> get their emailed results.

## 4. Cloudflare WAF — geo-lock (free plan, dashboard only)

Security → WAF → Custom rules → Create rule → then paste as custom expression
(skip the builder UI) and set action **Block**:

```
(ip.geoip.country in {"CN" "RU" "IR" "KP" "PK" "AF" "CU" "SY" "BY"}) and not cf.client.bot
```

- The `not cf.client.bot` exception is required — it keeps GPTBot / ClaudeBot /
  PerplexityBot crawling the site from wherever they operate
- Adjust the country list to your business reality at any time

## 5. First-deploy verification sweep

- [ ] `https://purpledrop.com` loads on HTTPS
- [ ] `https://purpledrop.com/.well-known/purpledrop.txt` → 200
- [ ] `https://purpledrop.com/sitemap.xml` → includes `/scorecard`, `/calculator`, `/soc2`
- [ ] `https://purpledrop.com/services` shows real page content in view-source (prerendered) — bots see full copy with no JS
- [ ] `https://purpledrop.com/llms.txt` and `/.well-known/ai.txt` → 200
- [ ] `/calculator` — shows the "logic & benchmarks" section; submit test → Formspree email arrives
- [ ] `/soc2` — full flow: email → code arrives → verify → 52 questions → results
- [ ] `/scorecard` and `/contact` forms → Formspree email arrives
- [ ] Social share URL shows a proper card (once og PNG is deployed — currently SVG, see NOTES)
- [ ] All pages render; check dev console for errors

## 6. Known follow-ups (deliberately deferred)

- **og:image is SVG** — Meta/LinkedIn/Twitter won't render it; generate a
  1200×630 PNG (reference: `scripts/generate-og-image.js` at workspace root).

Resolved Oct 31 (no action needed): CTA wording unified to 30-minute;
TESTIMONIALS = [] (empty until real quotes — not placeholders);
service names unified (route-seo.ts is the single source; `.well-known/purpledrop.txt` matches).
