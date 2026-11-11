import { SERVICES } from './content';
import { PRICING } from './pricing';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://purpledrop.com/#org',
  name: 'purpleDrop',
  url: 'https://purpledrop.com',
  logo: 'https://purpledrop.com/favicon.svg',
  description:
    'purpleDrop provides AI visibility reviews and website help. We record agreed checks, explain gaps and scope the next work.',
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
  description: 'AI visibility reviews, planning days and follow-through for business owners.',
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
        { '@type': 'Offer', name: 'Free 30-minute call', description: 'Free introductory call. Detailed review and report are paid work.', price: '0', priceCurrency: 'USD', url: 'https://purpledrop.com/pricing' },
        ...SERVICES.map(service => ({ '@type': 'Offer', name: service.title, description: service.outcome, price: String(PRICING[service.priceKey]), priceCurrency: 'USD', url: 'https://purpledrop.com/pricing' })),
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
