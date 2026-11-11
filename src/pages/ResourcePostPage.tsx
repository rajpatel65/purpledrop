import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO, essaySeo } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { JsonLd } from '../components/JsonLd';
import { articleSchema } from '../lib/schema';
import { ESSAYS } from '../lib/essays';

export function ResourcePostPage() {
  const { slug } = useParams<{ slug: string }>();
  const essay = ESSAYS.find((e) => e.slug === slug);

  if (!essay) {
    return <Navigate to="/not-found" replace />;
  }

  useSeo(essaySeo(essay.slug) ?? ROUTE_SEO['/not-found']);

  return (
    <Layout>
      <JsonLd data={articleSchema(essay)} />

      <article>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Reads', to: '/resources' }, { label: essay.title }]} />
        <header className="border-b border-line bg-paper py-24">
          <div className="container-page max-w-3xl">
            <FadeIn>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" />
                All essays
              </Link>
              <div className="mt-8 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-ink-faint">
                <span>{essay.date}</span>
                <span className="h-px w-6 bg-line" />
                <span className="text-violet">{essay.tag}</span>
                <span className="h-px w-6 bg-line" />
                <span>purpleDrop</span>
              </div>
              <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
                {essay.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-soft">{essay.blurb}</p>
            </FadeIn>
          </div>
        </header>

        <div className="border-b border-line bg-paper py-16">
          <div className="container-page max-w-3xl">
            <FadeIn>
              {essay.body.map((block, i) =>
                block.type === 'h2' ? (
                  <h2 key={i} className="mb-4 mt-14 font-serif text-3xl font-medium tracking-tight text-ink first:mt-0">
                    {block.content}
                  </h2>
                ) : block.type === 'pull' ? (
                  <blockquote
                    key={i}
                    className="mt-10 border-l-4 border-violet bg-cream/50 px-8 py-8 font-serif text-xl font-medium leading-relaxed text-ink"
                  >
                    {block.content}
                  </blockquote>
                ) : (
                  <p key={i} className="mb-6 text-base leading-[1.9] text-ink-soft first:mt-0">
                    {block.content}
                  </p>
                ),
              )}
            </FadeIn>
          </div>
        </div>
      </article>

      <CtaBand
        title="You don't have to guess where you stand."
        body="Use a free call to discuss your business. The paid review records agreed questions, answers, sources and gaps so you can decide what to fix."
        primaryLabel="Request a free 30-minute call"
        secondaryLabel="Read another essay"
        secondaryTo="/resources"
      />
    </Layout>
  );
      }
