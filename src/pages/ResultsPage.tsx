import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { Metrics } from '../components/Metrics';
import { CtaBand } from '../components/CtaBand';
import { OUTCOMES } from '../lib/content';
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
              The answer changes. Then the enquiries follow.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              We show clients the actual answer AI gives about them — before and after. That's the
              proof. Here's what that looks like in numbers.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-20">
        <div className="container-page">
          <FadeIn>
            <img
              src="/images/results-before-after.svg"
              alt="Before and after: an AI assistant's answer to a buyer's question names three competitors on day zero — three weeks later, the same question names your company first."
              className="aspect-[16/9] w-full rounded-2xl border border-line bg-paper object-cover shadow-soft"
              loading="lazy"
            />
          </FadeIn>
          <div className="mt-10">
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-ink-faint">
              A note on these numbers: each one is the <em>far end</em> of what we've
              documented on real engagements — the best day we've had, stated plainly.
              They are not averages and not guarantees. Your readouts will show your
              own numbers, every month.
            </p>
            <Metrics items={OUTCOMES} />
          </div>
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
        title="See where you stand — in three weeks."
        body="The First Conversation Review shows you the answer AI gives about your company, and you keep the report either way."
        primaryLabel="Book a call"
        secondaryLabel="Read the services"
        secondaryTo="/services"
      />
    </Layout>
  );
}
