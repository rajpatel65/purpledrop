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
    question: 'Book a 30-minute call',
    cta: { label: 'Book a 30-minute call', to: '/contact' },
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
  priceKey: 'audit' | 'spendAudit' | 'optimization' | 'trackingMonthly';
  priceNote?: string;
  guarantee: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'audit',
    step: '01',
    title: 'The First Conversation Review',
    tagline: 'The first answer decides who gets the call.',
    problem: 'You don\'t know what buyers hear first — or whether you\'re mentioned at all. Your competitors are in the shortlist while you aren\'t — and you never knew the question was asked.',
    outcome: 'A confidential review of the first conversation buyers have about your company. What\'s clear. What\'s missing. What\'s misunderstood. Where competitors appear instead of you. We also check your website\'s foundational health — WordPress plugin currency, dependency freshness, SEO on‑page factors, and design/layout consistency — because AI reads what\'s publicly visible, and so do cautious buyers.',
    timeline: '2–3 weeks',
    priceKey: 'audit',
    guarantee: 'Fixed price. Clear findings. Senior‑only. You keep the insight regardless.',
    bullets: [
      'What modern AI assistants currently understand about your company',
      'How your closest competitors appear in the same conversation',
      'What should be clear about you — but isn\'t',
      'A plain‑English walkthrough you can share with your team',
    ],
  },
  {
    id: 'spendAudit',
    step: '02',
    title: 'The Systems Efficiency Review',
    tagline: 'What you pay for, what you use, what you waste.',
    problem: 'Most companies pay for tools their teams barely touch — while missing the systems competitors quietly rely on. Last month\'s stack is quietly costing you the shortlist.',
    outcome: 'A senior‑led review of your software stack: What\'s used. What\'s duplicated. What\'s forgotten. Where automation could replace manual work. We also check for outdated libraries, unmaintained dependencies, and SEO gaps that silently erode rankings — then show you the report you keep either way.',
    timeline: '2–3 weeks',
    priceKey: 'spendAudit',
    guarantee: 'Fixed price. Clear savings. No jargon. You keep the report either way.',
    bullets: [
      'Every subscription mapped against actual usage',
      'Overlaps and duplicates identified',
      'Gaps where automation could take over',
      'A plain‑English walkthrough you can act on immediately',
    ],
  },
  {
    id: 'optimization',
    step: '03',
    title: 'The Clarity Build',
    tagline: 'Clarity wins the shortlist.',
    problem: 'If your company is hard to understand, the first answer will choose someone else — even if they\'re not better. The decision begins before you ever see it.',
    outcome: 'Your company becomes easier for modern decision systems to describe accurately: Your services. Your fees. Your strengths. Your proof. Clear. Consistent. Confirmable. Your website\'s technical health — plugin currency, SEO integrity, design consistency — is confirmed accurately, not assumed. You keep the findings either way.',
    timeline: '6–10 weeks',
    priceKey: 'optimization',
    priceNote: 'Includes the First Conversation Review',
    guarantee: 'Fixed price. No hourly billing. Three months of monitoring included. You keep the insight regardless.',
    bullets: [
      'Your company becomes easier for AI systems to describe',
      'Your services and fees become confirmable, not guessed',
      'Three months of monitoring included',
      'Senior‑only team, end to end',
    ],
  },
  {
    id: 'tracking',
    step: '04',
    title: 'The Monthly Signal Watch',
    tagline: 'See the movement. Stay ahead of it.',
    problem: 'The first answer changes as systems evolve — and as competitors adjust. Last month\'s position doesn\'t guarantee next month\'s. Your competitors are adjusting as you read this.',
    outcome: 'A monthly readout of how you appear in the first conversation: What changed. Why it changed. What to do next. You see movement instead of guessing. You stay ahead instead of reacting. You keep clarity instead of losing it quietly.',
    timeline: 'Monthly',
    priceKey: 'trackingMonthly',
    guarantee: 'Fixed monthly price. Quarterly review included. You keep the readouts either way.',
    bullets: [
      'Monthly readout of your position in the first conversation',
      'Changes flagged the moment they appear',
      'Quarterly strategy call with a senior strategist',
    ],
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


