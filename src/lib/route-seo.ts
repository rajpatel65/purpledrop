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
      'When a buyer asks AI who to hire, is your company in the answer? We find out what AI says about you — then we change it.',
    path: '/',
  },
  '/services': {
    title: 'Services — purpleDrop AI Visibility',
    description:
      'Four services: the First Conversation Review, the Systems Efficiency Review, the Clarity Build, and the Monthly Signal Watch. Fixed published prices, senior-only team, plain-English reporting.',
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
      'What changes when AI starts describing your company accurately: more mentions, more enquiries, and a report you actually read each month.',
    path: '/results',
  },
  '/pricing': {
    title: 'Pricing — purpleDrop',
    description:
      'Published prices, no hourly billing: First Conversation Review, Clarity Build, and Monthly Signal Watch. The price on the page is the price you pay.',
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
      "Check your website's SSL/TLS, security headers, email authentication, cookie flags, HTTPS enforcement, and DNS config. A senior engineer reviews your domain and emails the scorecard — free.",
    path: '/scorecard',
  },
  '/calculator': {
    title: 'SEO Risk & GEO Opportunity Calculator — purpleDrop',
    description:
      "See how much revenue you're losing as buyers shift from Google to AI assistants — and what GEO optimization could recapture.",
    path: '/calculator',
  },
  '/soc2': {
    title: 'SOC2 Readiness Assessment — purpleDrop',
    description:
      'A structured 42-question readiness assessment across eight controls. Verified by a real code sent to your email; a senior engineer reviews the results.',
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
