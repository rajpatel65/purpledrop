export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://purpledrop.pages.dev/#org',
  name: 'purpleDrop',
  url: 'https://purpledrop.pages.dev',
  logo: 'https://purpledrop.pages.dev/favicon.svg',
  description:
    'purpleDrop helps established companies get recommended by AI assistants. We audit what AI says about a company, then optimize so AI describes it accurately.',
  areaServed: ['US', 'CA', 'UK', 'AU'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    availableLanguage: 'English',
    areaServed: ['US', 'CA', 'UK', 'AU'],
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://purpledrop.pages.dev/#website',
  url: 'https://purpledrop.pages.dev',
  name: 'purpleDrop',
  description: 'We help companies get recommended by ChatGPT, Gemini, Claude, Perplexity, Copilot, and more.',
  publisher: { '@id': 'https://purpledrop.pages.dev/#org' },
};

export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: ['AI Visibility', 'AI Readiness', 'AI Optimization'],
    provider: { '@id': 'https://purpledrop.pages.dev/#org' },
    areaServed: ['US', 'CA', 'UK', 'AU'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'purpleDrop Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Free 30-minute call',
          description: 'Free introductory call with no obligation.',
          price: '0',
          priceCurrency: 'USD',
          url: 'https://purpledrop.pages.dev/pricing',
        },
        {
          '@type': 'Offer',
          name: 'AI-visibility audit',
          description: 'AI-visibility audit and findings report to keep.',
          price: '500',
          priceCurrency: 'USD',
          url: 'https://purpledrop.pages.dev/pricing',
        },
        {
          '@type': 'Offer',
          name: 'The consulting day',
          description: 'Audit plus one full day fixing the top issues with you.',
          price: '2000',
          priceCurrency: 'USD',
          url: 'https://purpledrop.pages.dev/pricing',
        },
        {
          '@type': 'Offer',
          name: 'The day plus follow-through',
          description: 'Audit and consulting day plus 30 days of monitoring and adjustments.',
          price: '3000',
          priceCurrency: 'USD',
          url: 'https://purpledrop.pages.dev/pricing',
        },
      ],
    },
  };
}

export function faqSchema(questions: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function articleSchema(essay: {
  slug: string;
  title: string;
  blurb: string;
  date: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: essay.title,
    description: essay.blurb,
    datePublished: essay.date,
    dateModified: essay.date,
    mainEntityOfPage: `https://purpledrop.pages.dev/resources/${essay.slug}`,
    author: { '@type': 'Organization', '@id': 'https://purpledrop.pages.dev/#org' },
    publisher: { '@id': 'https://purpledrop.pages.dev/#org' },
  };
}
