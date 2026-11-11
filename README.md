# purpleDrop website

This repository is the complete version-controlled website source: React/TypeScript pages, styles, prerendering scripts, public assets, Supabase Edge Functions and SQL migrations. Hosting configuration, saved credentials and production database contents are not included.

## Get a local copy

```sh
git clone https://github.com/rajpatel65/purpledrop.git
cd purpledrop
```

Use **Node.js 22** (see `.node-version`) and npm. If you use nvm:

```sh
nvm install 22
nvm use 22
npm ci
cp .env.example .env
npm run dev
```

The dev server prints its local address. After dependencies are installed, visual/source editing works offline. Live email verification, DNS/security checks, remote fonts, third-party services and database saves need network access and configured services. If the site has no live backend configuration, those flows will not work locally.

## Configuration

Edit `.env` using your own Supabase project URL and public anonymous key. It is ignored by git. The browser-facing `VITE_` values are public, not a place for secrets. The public scorecard widget also uses `VITE_TURNSTILE_SITE_KEY`; the hostname must be allowed in its Cloudflare widget settings.

Never commit real service-role keys, mail-provider keys, Turnstile secret keys or passwords. Server-only values belong in the Supabase project secrets. See `.env.example` for browser settings and the Edge Function source for required server settings. Do not copy a production service-role key into a `VITE_` variable.

## Build and tests

```sh
npm run build
npm run preview
npm run test:client
node scripts/test-calculator.mjs
```

`npm run build` type-checks TypeScript, builds the browser and prerender bundles, renders static route HTML and generates the sitemap. Output is `dist/`. The full build needs installed dependencies, not a production database. `npm run preview` serves that output locally.

For the public scorecard unit tests, install Deno and run:

```sh
deno test --allow-env --allow-net --no-check supabase/functions/tests/scorecard_test.ts
```

The historical `npm run test:functions` SOC2 harness currently needs maintenance because its temporary-file layout does not copy the newer shared scorecard module. It is not a deployment health check. Do not treat that harness failure as proof the live service is broken.

## Calculator

The homepage and `/calculator` use the same component and formula in `src/components/HomeCalculator.tsx`. Inputs are current monthly leads, lead-to-customer close rate, job value and the owner's extra-leads scenario. Results are monthly revenue estimates, not profit, ROI, measured AI visibility or an uplift promise. Zero remains zero; blank or invalid inputs do not generate results. The calculator does not submit a lead or require email.

## Edit and publish

Edit in a feature branch when possible, run the tests/build, review the changes, then commit and push. Pull current changes before your next edit session:

```sh
git pull --ff-only
git checkout -b my-site-change
# edit source files
npm run build
git add src README.md scripts
git commit -m "Describe the site change"
git push -u origin my-site-change
```

Open a pull request and merge after review. The connected Cloudflare Pages project builds the main branch. Check its deployment status and the live pages after merging. Production service settings and authentication are configured separately; cloning the repository does not grant publishing access.

Do not hand-edit `dist/` as the source. Supabase function changes require their own deployment and migrations require review before applying. Do not deploy unrelated function/database changes as part of a frontend edit.
