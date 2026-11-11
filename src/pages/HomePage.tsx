import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall, Mail, Shield, SearchCheck, ArrowUpRight, Smartphone } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { ProcessRail } from '../components/ProcessRail';
import { CHAPTERS, SERVICES, PROCESS, CONTACT } from '../lib/content';
import { homePageFaqs } from '../lib/faqs';
import { FaqList } from '../components/PricingTable';
import { AiAnswerCard } from '../components/AiAnswerCard';
import { PersonalitySelector } from '../components/PersonalitySelector';
import { HomeCalculator } from '../components/HomeCalculator';

const HeroScene = lazy(() => import('../components/HeroScene').then((m) => ({ default: m.HeroScene })));

function CheckCard({ number, title, subtitle, icon: Icon, children, dark = false }: {
  number: string; title: string; subtitle: string; icon: React.ElementType;
  children: React.ReactNode; dark?: boolean;
}) {
  return (
    <article className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 sm:p-8 ${dark ? 'border-violet-deep bg-violet-deep text-white shadow-[0_20px_60px_-30px_rgba(76,29,149,0.55)]' : 'border-line bg-paper text-ink shadow-[0_20px_60px_-40px_rgba(76,29,149,0.2)]'}`}>
      {dark && <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-violet/40 blur-3xl" />}
      <div className="relative mb-10 flex items-center justify-between">
        <span className={`font-mono text-xs tracking-[0.18em] ${dark ? 'text-violet-200' : 'text-ink-faint'}`}>{number} / YOUR NEXT QUESTION</span>
        <Icon className={`h-6 w-6 ${dark ? 'text-violet-200' : 'text-violet'}`} strokeWidth={1.4} />
      </div>
      <h3 className="relative font-serif text-[2rem] font-medium leading-tight tracking-tight">{title}</h3>
      <p className={`relative mt-4 text-base leading-relaxed ${dark ? 'text-violet-100' : 'text-ink-soft'}`}>{subtitle}</p>
      <div className="relative mt-7 flex flex-1 flex-col">{children}</div>
    </article>
  );
}

function Chapter({ index }: { index: number }) {
  const chapter = CHAPTERS[index];
  const last = index === CHAPTERS.length - 1;
  return (
    <section className={`relative py-24 ${index % 2 === 1 ? 'bg-cream/50' : 'bg-paper'}`}>
      <div className="container-page">
        <div className="grid gap-8 md:grid-cols-[64px_1fr] md:gap-12">
          <div className="hidden md:block">
            <FadeIn>
              <div className="sticky top-28 flex flex-col items-center gap-3">
                <span className="font-serif text-4xl font-medium text-violet">{chapter.index}</span>
                <span className="h-16 w-px bg-line" />
                <span className="rotate-180 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint [writing-mode:vertical-rl]">
                  {chapter.label}
                </span>
              </div>
            </FadeIn>
          </div>

          <div className="max-w-3xl">
            <FadeIn>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-violet md:hidden">
                {chapter.index} · {chapter.label}
              </p>
              <h2 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl md:mt-0">
                {chapter.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{chapter.body}</p>
              <p className="mt-10 font-serif text-2xl font-medium italic leading-snug text-ink sm:text-3xl">
                {chapter.question}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link to={chapter.cta.to} className="btn-primary">
                  {chapter.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {!last && (
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
                    Next — {CHAPTERS[index + 1].label}
                  </span>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  useSeo(ROUTE_SEO['/']);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Layout>
      {/* A single brand sculpture, with the offer kept in normal HTML. */}
      <section className="bg-paper pb-12 pt-10 md:pb-16 md:pt-14">
        <div className="container-page">
          <div className="grid gap-x-12 gap-y-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="contents lg:block lg:py-6">
              <h1 className="order-1 max-w-3xl font-serif text-[2.9rem] font-medium leading-[1.04] tracking-tight text-ink [text-wrap:balance] sm:text-6xl lg:text-[3.7rem] xl:text-[4.2rem]">
                Doing nothing is a decision.{' '}
                <span className="italic text-violet">Your competitors&rsquo; websites thank you for it.</span>
              </h1>
              <p className="order-3 mt-0 lg:mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">Every month, buyers get one answer and a shortlist. If your business isn&rsquo;t clear to the systems answering, someone else gets the call - and you never see it happen.</p>
              <div className="order-4 mt-0 lg:mt-7 flex flex-wrap gap-3">
                <a href="#tools" className="btn-primary">Explore the three checks <ArrowRight className="h-4 w-4" /></a>
                <Link to="/contact" className="btn-outline">Request a free 30-minute call</Link>
              </div>
              <p className="order-5 mt-0 lg:mt-5 max-w-lg text-sm leading-relaxed text-ink-soft">Check where you stand in three plain-English ways. Two free self-guided checks. A deeper security review when you need one.</p>
            </div>
            <div className="order-2 lg:order-none relative h-[350px] overflow-hidden rounded-[4px] bg-[#21152e] sm:h-[490px] lg:h-[640px]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_12%,rgba(181,148,216,0.19),transparent_65%)]" />
              <div className="absolute left-7 top-7 z-10 flex items-center gap-2 text-xs text-[#d6c5e7]"><span className="h-1.5 w-1.5 rounded-full bg-[#b9a0d4]" />purpleDrop / a clearer presence</div>
              {mounted ? <Suspense fallback={<img src="/drop-poster.svg" alt="" className="absolute inset-0 h-full w-full object-contain" />}><HeroScene /></Suspense> : <img src="/drop-poster.svg" alt="" className="absolute inset-0 h-full w-full object-contain" />}
              <p className="absolute bottom-7 left-7 right-7 border-t border-white/20 pt-4 text-xs leading-relaxed text-[#d6c5e7]">Less noise. More clarity.<span className="mt-1 block text-[#b7a2c9]">An illustration, not a visibility score.</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE CHOICES: two self-guided checks and a scoped paid review */}
      <section id="tools" className="relative overflow-hidden border-t border-line bg-cream/40 py-20 md:py-28">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-tint/60 blur-3xl" />
        <div className="container-page relative">
          <FadeIn>
            <div className="mb-12 grid gap-6 md:grid-cols-[1fr_0.65fr] md:items-end">
              <div>
                <p className="eyebrow">Three questions. A clearer next step.</p>
                <h2 className="mt-5 max-w-2xl font-serif text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">Start with the question<br className="hidden sm:block" /> on your mind.</h2>
              </div>
              <p className="max-w-md text-lg leading-relaxed text-ink-soft">Two quick checks you can do yourself. A deeper security review when you need one. No score dressed up as a promise.</p>
            </div>
          </FadeIn>
          <div className="grid gap-5 lg:grid-cols-3">
            <FadeIn>
              <CheckCard number="01" title="Can AI find me?" subtitle="Start with the answer your buyers might see." icon={SearchCheck} dark>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-violet-200">Free / self-guided</p>
                <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-5">
                  <p className="font-serif text-xl leading-snug">&ldquo;Who should I hire for [your service] in [your area]?&rdquo;</p>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-violet-100">Ask an AI assistant. Save the question, date, answer and linked sources. Is your business named? Is the description right? Repeat in another assistant.</p>
                <p className="mb-7 mt-4 text-xs leading-relaxed text-violet-200">One answer is a snapshot, not a ranking. Answers vary by tool, wording and time. This is a manual check, not an automated AI scan.</p>
                <Link to="/contact" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-white">Want help reading the answer? <ArrowUpRight className="h-4 w-4" /></Link>
              </CheckCard>
            </FadeIn>
            <FadeIn delay={0.08}>
              <CheckCard number="02" title="Is my site dated?" subtitle="Look at your website the way a new customer does." icon={Smartphone}>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-violet">Free / self-guided</p>
                <ol className="mt-5 divide-y divide-line text-sm leading-relaxed text-ink-soft">
                  <li className="py-3">Open it on your phone. Can you read it without pinching or zooming?</li>
                  <li className="py-3">Can a new visitor tell what you do, where you work and why to trust you?</li>
                  <li className="py-3">Try the main button and contact form. Is the next step obvious?</li>
                </ol>
                <p className="mb-7 mt-5 text-xs leading-relaxed text-ink-faint">A useful first look, not a performance test or accessibility audit. A redesign preview is a separate conversation.</p>
                <Link to="/contact" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-violet">Talk through a redesign preview <ArrowUpRight className="h-4 w-4" /></Link>
              </CheckCard>
            </FadeIn>
            <FadeIn delay={0.16}>
              <CheckCard number="03" title="Is my site safe?" subtitle="Start with public basics. Go deeper with a clear scope." icon={Shield}>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-violet">Free basics / paid review</p>
                <p className="mt-5 text-sm leading-relaxed text-ink-soft">The free scorecard checks six public homepage and DNS foundations. Verify your email to see temporary results on screen.</p>
                <Link to="/scorecard" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet">Run the free security scorecard <ArrowUpRight className="h-4 w-4" /></Link>
                <div className="my-6 border-t border-line pt-5">
                  <p className="font-semibold text-ink">Need more than the basics?</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">A paid security configuration review: agreed scope, findings and a prioritized fix plan.</p>
                </div>
                <p className="mb-7 text-xs leading-relaxed text-ink-faint">Neither option proves a site is secure. The review is not a penetration test or a certification.</p>
                <Link to="/contact" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-violet">Discuss a security review <ArrowUpRight className="h-4 w-4" /></Link>
              </CheckCard>
            </FadeIn>
          </div>
          <FadeIn>
            <div className="mt-7 flex flex-col justify-between gap-4 rounded-2xl border border-line bg-paper/70 p-6 sm:flex-row sm:items-center">
              <div><p className="font-semibold text-ink">Want to put a number on a what-if?</p><p className="mt-1 text-sm text-ink-soft">Use your own inputs. No invented losses, no predicted uplift.</p></div>
              <Link to="/calculator" className="inline-flex items-center gap-2 text-sm font-semibold text-violet">Open the lead value calculator <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PERSONALITY SELECTOR */}
      <PersonalitySelector />

      {/* STORYLINE — 4 chapters */}
      {CHAPTERS.map((_, i) => (
        <Chapter key={i} index={i} />
      ))}

      {/* TIER-2 EDUCATION — what buyers actually see */}
      <section id="learn" className="border-t border-line bg-violet-deep py-24 text-white">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
          <FadeIn>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200">
              If this is the first you&apos;re hearing of it
            </p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
              Your buyers ask an AI assistant before they call anyone.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-violet-100/90">
              No matter what your IT team, your consultants, or your web agency tell you, this is
              happening this week. Someone types a question like the one on the right, gets a short,
              confident list, and books two or three calls from it. Your company is either in that
              answer or it isn&apos;t — and nobody is telling you which.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link to="/contact" className="btn bg-white text-violet-deep hover:bg-violet-tint">
                See what it says about you
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="btn border border-white/40 text-white hover:bg-white/10">
                Who&apos;s behind this
              </Link>
              <Link to="/soc2" className="btn border border-white/40 text-white hover:bg-white/10">
                SOC2 Readiness Assessment
              </Link>
            </div>
            <p className="mt-8 text-sm leading-relaxed text-violet-200/80">
              Try it yourself right now: open ChatGPT, Claude, or Perplexity and ask
              &ldquo;Who should I hire for [your service]?&rdquo; — then see who appears.
            </p>
          </FadeIn>
          <AiAnswerCard />
        </div>
      </section>

      {/* CALCULATOR — Challenger moment */}
      <HomeCalculator />

      {/* SERVICES */}
      <section id="services" className="border-t border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">The work</p>
                <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                  Start free. Choose the support you need.
                </h2>
              </div>
              <Link to="/pricing" className="text-sm font-semibold text-violet hover:text-violet-deep">
                See full pricing →
              </Link>
            </div>
          </FadeIn>
          <div className="mt-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="border-t border-line py-8">
                <h3 className="font-serif text-3xl text-ink">{service.title}</h3>
                <p className="mt-3 max-w-2xl text-ink-soft">{service.outcome}</p>
                <Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet">Discuss the scope <ArrowRight className="h-4 w-4" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="border-t border-line bg-cream/50 py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">How we work</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              A story in four acts. You stay in the loop for every one.
            </h2>
          </FadeIn>
          <div className="mt-14">
            <ProcessRail acts={PROCESS} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-cream/50 py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Straight answers</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              The questions buyers ask before they call.
            </h2>
          </FadeIn>
          <div className="mt-10">
            <FaqList items={homePageFaqs} />
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="border-t border-line bg-paper py-16">
        <div className="container-page">
          <FadeIn>
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-cream/50 p-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
                  Or just talk to a person.
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                  A senior strategist answers — not a bot, not a sales sequence. Thirty minutes,
                  and you&apos;ll know where you stand.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${CONTACT.phone}`} className="btn-outline">
                  <PhoneCall className="h-4 w-4" />
                  {CONTACT.phone}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="btn-outline">
                  <Mail className="h-4 w-4" />
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <CtaBand
        title="Find out what the answer says about your company."
        body="Thirty minutes. We show you what AI says about you today — and what it's missing. You keep the findings either way."
        primaryLabel="Request a free 30-minute call"
      />
    </Layout>
  );
}
