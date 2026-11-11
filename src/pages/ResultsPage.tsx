import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { Breadcrumbs } from '../components/Breadcrumbs';

const HONEST = [
  'We don\'t promise a specific ranking in a specific tool by a specific date. Anyone who does is guessing.',
  'We don\'t invent results. When you ask for proof, you get the actual answer the AI gives about your company — before and after.',
  'We don\'t take credit for what you already earned. If AI already describes you well, we\'ll tell you on the first call and send you on your way.',
];

export function ResultsPage() {
  useSeo(ROUTE_SEO['/results']);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Results' }]} />
      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Results</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Evidence before outcome claims.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              A useful review records the question, the AI tool, the date, the answer and its sources.
              Changes can be compared only when the method is clear. We do not publish client outcome numbers without supporting evidence.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-20">
        <div className="container-page grid gap-8 md:grid-cols-3">
          {[
            ['Record the baseline', 'Keep the exact question, tool, date and answer. Separate a brand mention from a recommendation or citation.'],
            ['Show what changed', 'Compare like-for-like checks and show limitations. Website readiness is not proof of an AI recommendation.'],
            ['Keep the evidence', 'Use a dated findings report to agree the next work. No specific ranking, traffic or revenue is guaranteed.'],
          ].map(([title, body]) => <FadeIn key={title}><div className="card h-full p-8"><h2 className="font-serif text-2xl">{title}</h2><p className="mt-4 text-ink-soft">{body}</p></div></FadeIn>)}
        </div>
      </section>

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <FadeIn>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-violet" />
              <p className="eyebrow">What we won't promise</p>
            </div>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              We'd rather be honest than impressive.
            </h2>
            <ul className="mt-8 space-y-5">
              {HONEST.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-soft">
                  <span className="mt-0.5 text-violet">→</span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="card flex h-full flex-col justify-between p-8 md:p-10">
              <div>
                <p className="eyebrow">See it with your own eyes</p>
                <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink">
                  Ask us what AI says about you.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  We'll run the review and show you the answer — yours and your competitors'. No
                  slides, no theory. The actual conversation your buyers are having.
                </p>
              </div>
              <Link to="/contact" className="btn-primary mt-8 self-start">
                Get the answer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <CtaBand
        title="Start with a free 30-minute call."
        body="Start with a free 30-minute call. Then choose: audit $1,200; consulting day $2,500; day plus 30 days of monitoring and adjustments $4,500."
        primaryLabel="Request a free call"
        secondaryLabel="Read the services"
        secondaryTo="/services"
      />
    </Layout>
  );
}
