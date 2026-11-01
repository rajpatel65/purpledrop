export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://purpledrop.com/#org',
  name: 'purpleDrop',
  url: 'https://purpledrop.com',
  logo: 'https://purpledrop.com/favicon.svg',
  description:
    'purpleDrop helps established companies get recommended by AI assistants. We audit what AI says about a company, then optimize so AI describes it accurately.',
  foundingDate: '2024',
  numberOfEmployees: '2-10',
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
  '@id': 'https://purpledrop.com/#website',
  url: 'https://purpledrop.com',
  name: 'purpleDrop',
  description: 'We help companies get recommended by ChatGPT, Gemini, Claude, Perplexity, Copilot, and more.',
  publisher: { '@id': 'https://purpledrop.com/#org' },
};

export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: ['AI Visibility', 'AI Readiness', 'AI Optimization'],
    provider: { '@id': 'https://purpledrop.com/#org' },
    areaServed: ['US', 'CA', 'UK', 'AU'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'purpleDrop Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'The First Conversation Review',
          price: '2000',
          priceCurrency: 'USD',
          url: 'https://purpledrop.com/services',
        },
        {
          '@type': 'Offer',
          name: 'The Systems Efficiency Review',
          price: '5000',
          priceCurrency: 'USD',
          url: 'https://purpledrop.com/services',
        },
        {
          '@type': 'Offer',
          name: 'The Clarity Build',
          price: '10000',
          priceCurrency: 'USD',
          url: 'https://purpledrop.com/services',
        },
        {
          '@type': 'Offer',
          name: 'The Monthly Signal Watch',
          price: '1500',
          priceCurrency: 'USD',
          url: 'https://purpledrop.com/services',
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
    mainEntityOfPage: `https://purpledrop.com/resources/${essay.slug}`,
    author: { '@type': 'Organization', '@id': 'https://purpledrop.com/#org' },
    publisher: { '@id': 'https://purpledrop.com/#org' },
  };
}
