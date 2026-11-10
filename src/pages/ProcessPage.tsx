import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Users, FileCheck } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { ProcessRail } from '../components/ProcessRail';
import { CtaBand } from '../components/CtaBand';
import { PROCESS } from '../lib/content';
import { Breadcrumbs } from '../components/Breadcrumbs';

const PRINCIPLES = [
  {
    icon: FileCheck,
    title: 'Agreed on paper before it\'s built',
    body: 'Every engagement runs on a written scope and a fixed price. What we\'re building, and what it costs, is agreed in writing before work starts.',
  },
  {
    icon: ShieldCheck,
    title: 'Fixed price, in writing',
    body: 'The number on the page is the number you pay. No hourly billing, no "while we\'re in here" extras.',
  },
  {
    icon: Users,
    title: 'Senior-only, end to end',
    body: 'The strategist you meet in Act I is the one doing the work in Act III. We don\'t staff up with juniors to hit a margin.',
  },
];

export function ProcessPage() {
  useSeo(ROUTE_SEO['/process']);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Process' }]} />
      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">How we work</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              A story in four acts. You stay in the loop for every one.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Most engagements run the same way, because the way is the point: clear, and you see
              the work as it goes. We keep you informed at every step — but we don't wait for your
              approval. Most clients don't know what good looks like until they see it; that's what
              we're paid to know.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <ProcessRail acts={PROCESS} />
        </div>
      </section>

      <section className="border-b border-line bg-cream/50 py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">The rules of the road</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink">
              Three commitments we make on every engagement.
            </h2>
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.08}>
                <div className="card h-full p-8">
                  <p.icon className="h-6 w-6 text-violet" />
                  <h3 className="mt-5 font-serif text-xl font-medium tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-violet-tint bg-violet-tint/40 p-8 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-serif text-2xl font-medium tracking-tight text-ink">
                  AI-ready companies win the shortlist.
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                  Every day, your buyers ask AI who to call — and that answer becomes their
                  shortlist. We make sure your name is on it, with the proof AI needs to recommend
                  you with confidence, and we keep it there as the tools change. You get the
                  enquiries; we handle the mechanics.
                </p>
              </div>
              <Link to="/contact" className="btn-primary">
                Request a free call
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <CtaBand
        title="The first act is thirty minutes."
        body="No deck. No pressure. You walk away knowing how AI sees your company — whether we work together or not."
        primaryLabel="Start the first act"
      />
    </Layout>
  );
}
