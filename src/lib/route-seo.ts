/**
 * Single source of truth for per-route SEO strings.
 *
 * Pages spread from here (useSeo) and the prerender script reads the map to
 * inject <title>/<meta> into the static HTML - so a bot that never runs JS
 * still sees the exact same head tags a JS client gets.
 *
 * Fix copy HERE, not in the pages.
 */
import { ESSAYS } from './essays';

export interface RouteSeo {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

export const ROUTE_SEO: Record<string, RouteSeo> = {
  '/': {
    title: 'purpleDrop - AI Visibility Reviews & Website Help',
    description:
      'When a buyer asks AI who to hire, is your company in the answer? We find out what AI says about you - then improve the signals behind those answers and track what changes.',
    path: '/',
  },
  '/services': {
    title: 'Services - purpleDrop AI Visibility',
    description:
      'AI Visibility Review, Review + Planning Day, or Planning Day + 30-Day Support. Website redesigns and security configuration reviews are scoped separately.',
    path: '/services',
  },
  '/process': {
    title: 'How we work - purpleDrop',
    description:
      "Start with a free call, get a paid review, then choose a meeting day and follow-through. Fixes may take longer than the meeting day; scope and price are agreed first.",
    path: '/process',
  },
  '/results': {
    title: 'Results - purpleDrop',
    description:
      'How we document AI visibility: dated questions, answers, sources and limitations. No guaranteed rankings or client outcome statistics.',
    path: '/results',
  },
  '/pricing': {
    title: 'Pricing - purpleDrop',
    description:
      'Compare AI Visibility Review ($1,200), Review + Planning Day ($2,500), and Planning Day + 30-Day Support ($4,500). Fixes follow the agreed scope, not a one-day promise.',
    path: '/pricing',
  },
  '/about': {
    title: 'About - purpleDrop',
    description:
      'Practical AI visibility reviews and website help for business owners. Plain-English findings, written scope and no guaranteed recommendations or leads.',
    path: '/about',
  },
  '/contact': {
    title: 'Contact - purpleDrop',
    description:
      'Request a free 30-minute call to discuss your business and choose a next step. Detailed checks and a findings report are included in the paid review.',
    path: '/contact',
  },
  '/resources': {
    title: 'Essays & Notes - purpleDrop',
    description:
      'Plain-English guides to AI visibility, public business information and choosing what to fix. No guaranteed rankings or invented loss figures.',
    path: '/resources',
  },
  '/privacy': {
    title: 'Privacy - purpleDrop',
    description:
      'How contact requests, website checks, email verification and browser storage use information. Privacy draft for owner review before publication.',
    path: '/privacy',
  },
  '/terms': {
    title: 'Terms - purpleDrop',
    description:
      'The straightforward terms of working with purpleDrop: fixed prices, no guarantees nobody can make, and work you can follow at every step.',
    path: '/terms',
  },
  '/scorecard': {
    title: 'Free Security Scorecard - purpleDrop',
    description:
      "Check your website's SSL/TLS, security headers, email authentication, cookie flags, HTTPS enforcement, and DNS config. Verify your email with a code, then view six automated checks on screen. No emailed report.",
    path: '/scorecard',
  },
  '/calculator': {
    title: 'Lead Value Calculator - purpleDrop',
    description:
      "Estimate what extra monthly leads could be worth using your own close rate and job value. No predicted AI uplift, no email required.",
    path: '/calculator',
  },
  '/soc2': {
    title: 'SOC2 Readiness Assessment - purpleDrop',
    description:
      'A 42-question self-reported readiness assessment across nine sections. Email verification protects access, not the accuracy of answers. Not an audit or attestation.',
    path: '/soc2',
    noindex: true,
  },
  '/not-found': {
    title: 'Page not found - purpleDrop',
    description: "That page doesn't exist. Let's get you back where you were headed.",
    path: '/not-found',
  },
};

export function essaySeo(slug: string): RouteSeo | null {
  const essay = ESSAYS.find((e) => e.slug === slug);
  if (!essay) return null;
  return {
    title: `${essay.title} - purpleDrop`,
    description: essay.blurb,
    path: `/resources/${essay.slug}`,
    type: 'article',
  };
}
