import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const BASE = 'https://purpledrop.com';
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/process', priority: '0.8', changefreq: 'monthly' },
  { path: '/results', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/resources', priority: '0.7', changefreq: 'weekly' },
  { path: '/scorecard', priority: '0.8', changefreq: 'monthly' },
  { path: '/calculator', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
];

const ESSAY_SLUGS = [
  'your-buyers-ask-ai-before-they-ask-you',
  'the-report-your-web-agency-sends-you',
  'the-quiet-cost-of-a-beautiful-website',
  'who-does-ai-recommend',
  'you-are-not-in-the-answer',
  'owned-vs-rented-visibility',
  'good-better-best',
  'what-ai-is-skeptical-of',
  'the-blue-check-moment',
];

const urls = [
  ...STATIC_ROUTES,
  ...ESSAY_SLUGS.map((slug) => ({ path: `/resources/${slug}`, priority: '0.6', changefreq: 'monthly' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE}${u.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const out = resolve(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(out, xml + '\n');
console.log(`Sitemap written to ${out}`);

const distDir = resolve(process.cwd(), 'dist');
writeFileSync(resolve(distDir, 'sitemap.xml'), xml + '\n');
const wellKnownSrc = resolve(process.cwd(), 'public', '.well-known', 'purpledrop.txt');
const wellKnownDestDir = resolve(distDir, '.well-known');
mkdirSync(wellKnownDestDir, { recursive: true });
copyFileSync(wellKnownSrc, resolve(wellKnownDestDir, 'purpledrop.txt'));
const aiTxtSrc = resolve(process.cwd(), 'public', '.well-known', 'ai.txt');
if (existsSync(aiTxtSrc)) copyFileSync(aiTxtSrc, resolve(wellKnownDestDir, 'ai.txt'));
console.log(`Copied .well-known/ to ${wellKnownDestDir}`);
