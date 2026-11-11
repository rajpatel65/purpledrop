# Public-host cutover (not performed)
Current canonical host: https://purpledrop.pages.dev
No DNS or domain changes are included in this release. Business email addresses are unchanged.

After the owner authorizes cutover and purpledrop.com has resolving DNS and trusted HTTPS:
1. Change the host constants in src/hooks/useSeo.ts, src/lib/schema.ts, scripts/prerender.mjs and scripts/generate-sitemap.mjs.
2. Update public/robots.txt, public/llms.txt and public/.well-known/{purpledrop,ai}.txt website links.
3. Build and deploy. Confirm raw and rendered canonical, og:url, schema IDs, robots and all sitemap URLs use the approved canonical host.
4. Verify every sitemap URL. Configure deliberate permanent redirects from the old host, retaining paths, only under approved cutover scope.
5. Verify Search Console property/sitemap and monitor crawl/redirect errors. Keep email DNS separate.
Revert this release through Git if its site changes cause regressions; do not roll back independently approved DNS changes by inference.
