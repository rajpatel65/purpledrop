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
    "index": "01",
    "label": "The risk",
    "title": "If buyers do not see you, they cannot choose you.",
    "body": "A buyer asks an AI assistant who to hire. If your business is missing from the answer, they may contact someone else. You may never see that missed enquiry. We help you check the gap before deciding what to change.",
    "question": "Does your business appear?",
    "cta": {
      "label": "Check what AI says",
      "to": "/contact"
    }
  },
  {
    "index": "02",
    "label": "The check",
    "title": "Start with the questions your customers ask.",
    "body": "We test agreed questions about your services and location, then record the tool, date and answer. You see whether your business is mentioned, whether the details are right and which sources the answer uses. This is a sample, not a record of every buyer conversation.",
    "question": "See the answer, not a guess.",
    "cta": {
      "label": "See how the review works",
      "to": "/process"
    }
  },
  {
    "index": "03",
    "label": "The work",
    "title": "Make your business easier to find and understand.",
    "body": "Missing service pages, conflicting business details and unclear contact information can leave buyers with questions. Our review identifies gaps in your website and public listings, explains why they matter and puts the work in order.",
    "question": "Know what to fix first.",
    "cta": {
      "label": "Compare the options",
      "to": "/services"
    }
  },
  {
    "index": "04",
    "label": "The next step",
    "title": "Choose a report, a day together, or support afterward.",
    "body": "Get a findings report you can give to your web team. Add a day with us to review it and agree the work. Choose 30 days of support if you want follow-through. Fixes may take longer than the meeting day, and the written scope sets out what is included.",
    "question": "Start with a free 30-minute call.",
    "cta": {
      "label": "Request a free 30-minute call",
      "to": "/contact"
    }
  }
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
    "id": "audit",
    "step": "01",
    "title": "AI Visibility Review",
    "tagline": "Get the findings and know what to fix first.",
    "problem": "Not sure whether AI can find and describe your business?",
    "outcome": "A review of agreed buyer questions, your website and public listings, with a findings report you keep.",
    "timeline": "Review + written report",
    "priceKey": "audit",
    "guarantee": "You keep the report and can share it with your web team.",
    "bullets": [
      "Agreed buyer questions checked in AI tools",
      "Website and public listing gaps explained",
      "Prioritized findings report; no meeting day included"
    ]
  },
  {
    "id": "consultingDay",
    "step": "02",
    "title": "Review + Planning Day",
    "tagline": "Get the review, then spend a day with us planning the work.",
    "problem": "Want help deciding what to do with the findings?",
    "outcome": "The AI Visibility Review plus a day with you to review the findings, set priorities and agree the next steps.",
    "timeline": "Review + 1 meeting day",
    "priceKey": "consultingDay",
    "guarantee": "The day is time with you, not a promise to finish every fix in a day.",
    "bullets": [
      "Everything in the AI Visibility Review",
      "One day together to review findings and make decisions",
      "Written scope: included fixes, owners and completion dates"
    ]
  },
  {
    "id": "consultingPlus",
    "step": "03",
    "title": "Planning Day + 30-Day Support",
    "tagline": "Get the review and planning day, with support afterward.",
    "problem": "Want help following through after the meeting?",
    "outcome": "The AI Visibility Review and Planning Day, plus 30 days of monitoring and agreed adjustments.",
    "timeline": "Review + meeting day + 30 days",
    "priceKey": "consultingPlus",
    "guarantee": "The written scope defines the checks, adjustments and support included.",
    "bullets": [
      "Everything in Review + Planning Day",
      "30 days of monitoring and agreed adjustments",
      "Progress updates showing what changed and what remains"
    ]
  }
];

export interface ProcessAct {
  act: string;
  title: string;
  body: string;
}

export const PROCESS: ProcessAct[] = [
  {
    "act": "Step 1",
    "title": "Tell us about your business",
    "body": "Start with a free 30-minute call. Tell us what you sell, where you work and who you want to reach. We explain the review and help you decide whether it is useful. No obligation to buy."
  },
  {
    "act": "Step 2",
    "title": "See what buyers could find",
    "body": "In the paid review, we test agreed questions and inspect your website and public listings. The report separates what we observed from what we could not verify. Missing from one answer does not mean missing from every answer."
  },
  {
    "act": "Step 3",
    "title": "Agree the work before it starts",
    "body": "Choose the report alone or add a day together to review it and decide what to do. We agree the scope, price, responsibilities and completion dates in writing. Fixes may take longer than the meeting day. Extra work needs your approval."
  },
  {
    "act": "Step 4",
    "title": "Check what changed",
    "body": "If you choose 30-Day Support, we monitor the agreed checks and make the adjustments in your scope for 30 days. We show progress and remaining gaps. We do not promise rankings, AI recommendations or a set number of leads."
  }
];

export interface Outcome {
  metric: string;
  label: string;
}

// No client outcome statistics are published without supporting evidence.
export const OUTCOMES: Outcome[] = [];

export const CONTACT = {
  email: 'info@purpledrop.com',
} as const;

export interface TestimonialSlot {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: TestimonialSlot[] = [];
