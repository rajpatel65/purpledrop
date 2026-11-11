/**
 * Single source of truth for per-route SEO strings.
 *
 * Pages spread from here (useSeo) and the prerender script reads the map to
 * inject <title>/<meta> into the static HTML — so a bot that never runs JS
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
}

export const ROUTE_SEO: Record<string, RouteSeo> = {
  '/': {
    title: 'purpleDrop — Get Recommended by AI',
    description:
      'When a buyer asks AI who to hire, is your company in the answer? We find out what AI says about you - then improve the signals behind those answers and track what changes.',
    path: '/',
  },
  '/services': {
    title: 'Services — purpleDrop AI Visibility',
    description:
      'Start with a free 30-minute call. If you continue, one day of consulting costs $2,000.',
    path: '/services',
  },
  '/process': {
    title: 'How we work — purpleDrop',
    description:
      "Four acts, one fixed price. Here's what working with purpleDrop actually feels like — told in plain English.",
    path: '/process',
  },
  '/results': {
    title: 'Results — purpleDrop',
    description:
      'How we document AI visibility: dated questions, answers, sources and limitations. No guaranteed rankings or client outcome statistics.',
    path: '/results',
  },
  '/pricing': {
    title: 'Pricing — purpleDrop',
    description:
      'Free 30-minute call, then three options: audit $500, consulting day $2,000, day plus 30 days monitoring $3,000.',
    path: '/pricing',
  },
  '/about': {
    title: 'About — purpleDrop',
    description:
      'purpleDrop is a senior-only team helping companies get recommended by AI. Working with companies across the United States.',
    path: '/about',
  },
  '/contact': {
    title: 'Contact — purpleDrop',
    description:
      'Request a free 30-minute call. We show you what AI says about your company today, and you keep the findings either way. No pitch, no pressure.',
    path: '/contact',
  },
  '/resources': {
    title: 'Essays & Notes — purpleDrop',
    description:
      'Notes on the new search: how AI decides who to recommend, what it means for your company, and what actually changes who it picks.',
    path: '/resources',
  },
  '/privacy': {
    title: 'Privacy — purpleDrop',
    description:
      'How purpleDrop handles your data: we collect almost nothing, sell nothing, and never spam. The full legal detail, written to be read.',
    path: '/privacy',
  },
  '/terms': {
    title: 'Terms — purpleDrop',
    description:
      'The straightforward terms of working with purpleDrop: fixed prices, no guarantees nobody can make, and work you can follow at every step.',
    path: '/terms',
  },
  '/scorecard': {
    title: 'Free Security Scorecard — purpleDrop',
    description:
      "Check your website's SSL/TLS, security headers, email authentication, cookie flags, HTTPS enforcement, and DNS config. Verify your email with a code, then view six automated checks on screen. No emailed report.",
    path: '/scorecard',
  },
  '/calculator': {
    title: 'Lead Value Calculator — purpleDrop',
    description:
      "Estimate what extra monthly leads could be worth using your own close rate and job value. No predicted AI uplift, no email required.",
    path: '/calculator',
  },
  '/soc2': {
    title: 'SOC2 Readiness Assessment — purpleDrop',
    description:
      'A 42-question self-reported readiness assessment across nine sections. Email verification protects access, not the accuracy of answers. Not an audit or attestation.',
    path: '/soc2',
  },
  '/not-found': {
    title: 'Page not found — purpleDrop',
    description: "That page doesn't exist. Let's get you back where you were headed.",
    path: '/not-found',
  },
};

export function essaySeo(slug: string): RouteSeo | null {
  const essay = ESSAYS.find((e) => e.slug === slug);
  if (!essay) return null;
  return {
    title: `${essay.title} — purpleDrop`,
    description: essay.blurb,
    path: `/resources/${essay.slug}`,
    type: 'article',
  };
}
