export interface Chapter {
  index: string;
  label: string;
  title: string;
  body: string;
  question: string;
  cta: { label: string; to: string };
}

export const CHAPTERS: Chapter[] = [
  {
    index: '01',
    label: 'They asked',
    title: 'The first answer decides who gets the call.',
    body: 'A buyer asks a question. A system answers. A shortlist forms. You\'re either in it — or you\'re not. The decision begins before you ever see it.',
    question: 'Who was on that list?',
    cta: { label: 'Find out where you stand', to: '/services' },
  },
  {
    index: '02',
    label: 'The answer',
    title: 'It felt certain. Until now.',
    body: 'Buyers rarely question the first answer. It feels authoritative — a list of names that seem obvious. By the time anyone reaches your website, the shortlist is already set. But the first answer can be shaped.',
    question: 'Were you in it?',
    cta: { label: 'Find out', to: '/contact' },
  },
  {
    index: '03',
    label: 'The shortlist',
    title: 'It named someone else.',
    body: 'Not always the best company. Not the most experienced. Just the clearest — the one the system could understand with zero effort. If you think "our buyers don\'t use AI," that\'s exactly what your competitors\' buyers used.',
    question: 'See where you stand',
    cta: { label: 'See where you stand', to: '/services' },
  },
  {
    index: '04',
    label: 'The shift',
    title: 'You can shape what the first answer says.',
    body: 'We run a confidential review of the first conversation buyers have about your company — the one you never see. We show you what\'s missing, what\'s misunderstood, and what\'s working. Then we help you shape the answer so you\'re chosen more often. You stay in the loop. You keep the findings. You see the movement.',
    question: 'Request a free 30-minute call',
    cta: { label: 'Request a free 30-minute call', to: '/contact' },
  },
];

export interface Service {
  id: string;
  step: string;
  title: string;
  tagline: string;
  problem: string;
  outcome: string;
  timeline: string;
  priceKey: 'audit' | 'consultingDay' | 'consultingPlus';
  priceNote?: string;
  guarantee: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'audit', step: '01', title: 'AI-visibility audit',
    tagline: 'Good: understand what needs attention.',
    problem: 'Start with a free 30-minute call to discuss your website.',
    outcome: 'An AI-visibility audit with a findings report that is yours to keep.',
    timeline: 'Audit and findings report', priceKey: 'audit',
    guarantee: 'The findings report is yours to keep.',
    bullets: ['AI-visibility audit', 'Findings report to keep'],
  },
  {
    id: 'consultingDay', step: '02', title: 'The consulting day',
    tagline: 'Better: understand the issues, then work on them together.',
    problem: 'Want help acting on the findings, not just reading them?',
    outcome: 'The audit plus one full day working with you to fix the top issues.',
    timeline: '1 consulting day', priceKey: 'consultingDay',
    guarantee: 'Agree on the focus before the consulting day starts.',
    bullets: ['AI-visibility audit and findings report', 'One full day fixing the top issues with you'],
  },
  {
    id: 'consultingPlus', step: '03', title: 'The day plus follow-through',
    tagline: 'Best: a consulting day with 30 days of follow-through.',
    problem: 'Want support after the consulting day?',
    outcome: 'The audit and consulting day, plus 30 days of monitoring and adjustments.',
    timeline: '1 consulting day + 30 days', priceKey: 'consultingPlus',
    guarantee: '30 days of monitoring and adjustments are included.',
    bullets: ['AI-visibility audit and findings report', 'One full day fixing the top issues with you', '30 days of monitoring and adjustments'],
  },
];

export interface ProcessAct {
  act: string;
  title: string;
  body: string;
}

export const PROCESS: ProcessAct[] = [
  {
    act: 'Act I',
    title: 'We listen',
    body: 'Thirty minutes. One straight answer. We learn your business, your market, and your goals. You walk away knowing where you stand — even if we never work together. The decision begins before you ever see it.',
  },
  {
    act: 'Act II',
    title: 'We reveal the first conversation',
    body: 'We surface the first conversation buyers have about your company — the one you never see. Not a theory. Not a slide. The actual answer that shapes the shortlist. You see: What\'s clear. What\'s missing. What\'s misunderstood. Where competitors appear instead of you. This is the moment most clients realize the shift: The decision begins long before anyone visits a website.',
  },
  {
    act: 'Act III',
    title: 'We shape it',
    body: 'Once scope and price are agreed in writing, we do the work. You see progress as it happens — not at the end. You always know what\'s being built, why it matters, and where it stands. No hourly billing. No "while we\'re in here" extras. No junior teams. Your strengths become easier to understand. Your proof becomes easier to confirm. Your position becomes easier to recommend. Clarity wins the shortlist.',
  },
  {
    act: 'Act IV',
    title: 'We keep it honest',
    body: 'The first conversation evolves as systems evolve — and as competitors adjust. We track your position each month and flag changes the moment they appear. You see movement instead of guessing. You stay ahead instead of reacting. You keep clarity instead of losing it quietly. You stay in the loop.',
  },
];

export interface Outcome {
  metric: string;
  label: string;
}

// Our best documented results — never presented as averages or promises.
// Every number here is the far end of what we have measured, labeled with its basis.
export const OUTCOMES: Outcome[] = [
  { metric: '3.1×', label: 'the largest lift in a client\'s AI mentions we\'ve measured between monthly readouts — our best case, not a guarantee' },
  { metric: '6 of 10', label: 'of the clients we\'ve worked with were shortlisted within their first quarter — the ones we could make clear enough to describe' },
  { metric: '1 business day', label: 'a straight written answer to your enquiry — our standing commitment, before the shortlist sets' },
  { metric: '0', label: 'hourly billing, ever — the price agreed in writing before any work starts' },
];

export const CONTACT = {
  email: 'info@purpledrop.com',
  phone: '+1 704 490 1737',
} as const;

export interface TestimonialSlot {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: TestimonialSlot[] = [];
