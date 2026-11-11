import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { ESSAYS } from '../lib/essays';

export function ResourcesPage() {
  useSeo(ROUTE_SEO['/resources']);

  return (
    <Layout>
      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Essays &amp; Notes</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Plain-English guides to getting found.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              What to check in AI answers, why clear business details matter and how to choose
              the next work. Practical guidance, not promises about how every AI tool behaves.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            {ESSAYS.map((essay, i) => (
              <FadeIn key={essay.slug} delay={i * 0.05}>
                <Link
                  to={`/resources/${essay.slug}`}
                  className="card group flex h-full flex-col p-8 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
                    <span>{essay.date}</span>
                    <span className="h-px w-6 bg-line" />
                    <span className="text-violet">{essay.tag}</span>
                  </div>
                  <h2 className="mt-5 font-serif text-2xl font-medium leading-snug tracking-tight text-ink transition-colors group-hover:text-violet">
                    {essay.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{essay.blurb}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    Read the essay
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Reading about it is one thing. Knowing where you stand is another."
        body="Discuss your business and find out what a paid AI Visibility Review includes. Start with a free 30-minute call."
        primaryLabel="Request a free 30-minute call"
      />
    </Layout>
  );
}
