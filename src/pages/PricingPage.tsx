import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { PricingTable, FaqList } from '../components/PricingTable';
import { CtaBand } from '../components/CtaBand';
import { JsonLd } from '../components/JsonLd';
import { serviceSchema, faqSchema } from '../lib/schema';
import { homePageFaqs } from '../lib/faqs';
import { Breadcrumbs } from '../components/Breadcrumbs';

const NOT_INCLUDED = [
  { title: 'Design-only refreshes', body: 'We take on full website redesigns when AI visibility is the goal, quoted separately from $5,000. If you only want a visual refresh, we\'ll say so and point you to someone who does that well.' },
  { title: 'Advertising or paid media', body: 'We improve what AI and search say about you organically. We don\'t buy visibility.' },
  { title: 'Guaranteed rankings', body: 'Nobody can guarantee a specific position in an AI answer. If someone does, they\'re guessing with your money.' },
];

export function PricingPage() {
  useSeo(ROUTE_SEO['/pricing']);

  return (
    <Layout>
      <JsonLd data={serviceSchema()} />
      <JsonLd data={faqSchema(homePageFaqs)} />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Pricing' }]} />

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Pricing</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Start free. Choose the support you need.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Start with a free 30-minute call. Then choose an audit for $1,200, a consulting day
              for $2,500, or the day plus 30 days of monitoring and adjustments for $4,500.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-20">
        <div className="container-page">
          <FadeIn>
            <PricingTable />
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-line bg-cream/50 p-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet" />
                <span>
                  The call is free. Choose your level of support afterward, with no obligation.
                </span>
              </p>
              <Link to="/contact" className="btn-primary">
                Request a free call
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page grid gap-12 md:grid-cols-3">
          {NOT_INCLUDED.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div>
                <h3 className="font-serif text-xl font-medium tracking-tight text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-b border-line bg-cream/50 py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Questions</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink">
              Before you decide.
            </h2>
          </FadeIn>
          <div className="mt-10">
            <FaqList items={homePageFaqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Every engagement starts the same way."
        body="Thirty minutes. You leave knowing where you stand — whether we work together or not."
        primaryLabel="Request a free 30-minute call"
      />
    </Layout>
  );
}
