/**
 * Static prerender pass (the core GEO fix).
 *
 * Cloudflare Pages serves whatever is in dist/ as plain files, so we turn the
 * SPA into pre-rendered HTML per route: AI crawlers and social scrapers that
 * never execute JS now see full page content + head tags instead of an empty
 * <div id="root">. The client then hydrates (main.tsx).
 *
 * How: loads the built dist/index.html as a template, renders each route via
 * the SSR bundle (built by `vite build --ssr src/entry-prerender.tsx`),
 * injects the per-route <title>/og/meta strings from src/lib/route-seo.ts
 * (same map the pages use), then writes dist/<route>/index.html.
 * NotFound also prerenders to dist/404.html (Cloudflare Pages serves it
 * automatically for unknown paths).
 *
 * Run by `npm run build` (after vite build). Files here are regenerated.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const BASE_URL = 'https://purpledrop.com';

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const bundlePath = resolve(process.cwd(), 'dist', '.ssr', 'entry-prerender.js');
const { render, ROUTE_SEO, essaySeo, ESSAYS } = await import(pathToFileURL(bundlePath).href);

const template = readFileSync(resolve(process.cwd(), 'dist', 'index.html'), 'utf8');

const routes = [
  ...Object.keys(ROUTE_SEO).filter((r) => r !== '/not-found'),
  ...ESSAYS.map((e) => `/resources/${e.slug}`),
];

function prerenderFile(route, outPath) {
  const seo =
    route.startsWith('/resources/')
      ? essaySeo(route.split('/').pop())
      : ROUTE_SEO[route] ?? ROUTE_SEO['/not-found'];
  const body = render(route);
  const html = template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(seo.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
      `<meta name="description" content="${esc(seo.description)}" />`,
    )
    .replace(
      '</head>',
      (seo.noindex ? `    <meta name="robots" content="noindex, nofollow" />\n` : '') +
      `    <meta property="og:title" content="${esc(seo.title)}" />\n` +
        `    <meta property="og:description" content="${esc(seo.description)}" />\n` +
        `    <meta property="og:type" content="${seo.type === 'article' ? 'article' : 'website'}" />\n` +
        `    <meta property="og:url" content="${BASE_URL}${route}" />\n` +
        `    <link rel="canonical" href="${BASE_URL}${route}" />\n` +
        '  </head>',
    )
    .replace('<div id="root">\n</div>', '<div id="root"></div>')
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace(
      '<script type="module"',
      '<script>window.__PRERENDERED__=true;</script><script type="module"',
    );
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`  prerendered ${route} -> ${outPath.replace(process.cwd() + '/', '')} (${(html.length / 1024).toFixed(0)} KB)`);
}

for (const route of routes) {
  // path.join (not resolve): route paths start with '/' and resolve() would
  // treat that as filesystem root.
  if (route === '/') prerenderFile(route, resolve(process.cwd(), 'dist', 'index.html'));
  else prerenderFile(route, join(process.cwd(), 'dist', route, 'index.html'));
}

// Custom 404: Cloudflare Pages auto-serves dist/404.html for unknown paths.
prerenderFile('/not-found', resolve(process.cwd(), 'dist', '404.html'));

// The SSR bundle is not needed at runtime — keep dist clean.
rmSync(resolve(process.cwd(), 'dist', '.ssr'), { recursive: true, force: true });

console.log('Prerender complete.');
