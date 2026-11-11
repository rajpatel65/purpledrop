import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall, Mail, Shield, Calculator, SearchCheck, ArrowUpRight, Smartphone } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { ServiceRow } from '../components/ServiceRow';
import { ProcessRail } from '../components/ProcessRail';
import { CHAPTERS, SERVICES, PROCESS, CONTACT } from '../lib/content';
import { homePageFaqs } from '../lib/faqs';
import { FaqList } from '../components/PricingTable';
import { AiAnswerCard } from '../components/AiAnswerCard';
import { PersonalitySelector } from '../components/PersonalitySelector';
import { HomeCalculator } from '../components/HomeCalculator';

const HeroScene = lazy(() => import('../components/HeroScene').then((m) => ({ default: m.HeroScene })));

type FreeTool = {
  to: string;
  label: string;
  description: string;
  icon: React.ElementType;
  highlight: string;
};

const FREE_TOOLS: FreeTool[] = [
  {
    to: '/soc2',
    label: 'SOC2 Readiness Assessment',
    description: '42 questions across CC1–CC9. Email-verified. Download JSON/CSV gap report. Every "No" and "Don\'t know" becomes a lead signal for us.',
    icon: Shield,
    highlight: 'Most comprehensive',
  },
  {
    to: '/scorecard',
    label: 'Security Scorecard',
    description: 'Verify your email with a code, then view six automated public checks on screen. Results last up to 10 minutes and clear when you leave or switch tabs. No report is emailed.',
    icon: SearchCheck,
    highlight: 'Instant on-screen checks',
  },
  {
    to: '/calculator',
    label: 'Lead Value Calculator',
    description: 'Explore a hypothetical revenue scenario using your inputs and the assumptions shown. This is not a forecast.',
    icon: Calculator,
    highlight: 'Revenue math',
  },
];

function FreeToolCard({ tool }: { tool: typeof FREE_TOOLS[0] }) {
  const Icon = tool.icon;
  return (
    <Link
      to={tool.to}
      className="group relative flex flex-col h-full p-6 bg-paper border border-line rounded-2xl hover:border-violet/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="p-3 rounded-xl bg-violet-tint text-violet group-hover:bg-violet group-hover:text-white transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        {tool.highlight && (
          <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-[0.1em] bg-violet/10 text-violet rounded-full">
            {tool.highlight}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-lg text-ink mb-2 group-hover:text-violet transition-colors">{tool.label}</h3>
      <p className="text-sm text-ink-soft leading-relaxed flex-1 mb-4">{tool.description}</p>
      <div className="flex items-center gap-2 text-sm font-medium text-violet group-hover:gap-3 transition-all">
        Start now
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </Link>
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

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-paper">
        <div className="container-page">
          <div className="grid items-stretch lg:grid-cols-[1.08fr_0.92fr]">
            <div className="flex flex-col justify-center py-20 md:py-24 lg:py-32 lg:pr-14">
              <FadeIn>
                <p className="eyebrow">AI & search visibility experts</p>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h1 className="mt-6 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.4rem]">
                  Doing nothing is a decision.{' '}
                  <span className="italic text-violet">Your competitors&rsquo; websites thank you for it.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.16}>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
                  Every month, buyers get one answer and a shortlist. If your business isn&rsquo;t clear
                  to the systems answering, someone else gets the call - and you never see it happen.
                  Check where you stand in three plain-English ways. Free to look, yours to keep.
                </p>
              </FadeIn>
              <FadeIn delay={0.24}>
                <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Link to="/scorecard" className="btn-primary">
                    See where you stand - free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/contact" className="btn-outline">
                    Request a free 30-minute call
                  </Link>
                </div>
                <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
                  <Calculator className="h-4 w-4 text-violet" />
                  What are a few lost jobs a month worth?{' '}
                  <Link to="/calculator" className="font-medium text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">
                    Put your own numbers in the calculator.
                  </Link>
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <Link to="/scorecard" className="group rounded-xl border border-line bg-cream/40 p-4 transition-colors hover:border-violet/30 hover:bg-cream/70">
                    <div className="flex items-center gap-2 font-semibold text-ink">
                      <SearchCheck className="h-4 w-4 text-violet" />
                      Can AI find me?
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      Free check. See what the first answer can and can&rsquo;t say about you.
                    </p>
                  </Link>
                  <Link to="/scorecard" className="group rounded-xl border border-line bg-cream/40 p-4 transition-colors hover:border-violet/30 hover:bg-cream/70">
                    <div className="flex items-center gap-2 font-semibold text-ink">
                      <Smartphone className="h-4 w-4 text-violet" />
                      Is my site dated?
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      Free check. Your site on a phone, and what it&rsquo;s really built on.
                    </p>
                  </Link>
                  <Link to="/services" className="group rounded-xl border border-line bg-cream/40 p-4 transition-colors hover:border-violet/30 hover:bg-cream/70">
                    <div className="flex items-center gap-2 font-semibold text-ink">
                      <Shield className="h-4 w-4 text-violet" />
                      Is my site safe?
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      Free basics now, full security review with a fix plan when you&rsquo;re ready.
                    </p>
                  </Link>
                </div>
              </FadeIn>
              <FadeIn delay={0.32}>
                <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
                  100% senior-led · Fixed published prices · You keep the audit report
                </p>
              </FadeIn>
            </div>

            {/* Shaded 3D panel */}
            <div className="relative h-[340px] sm:h-[440px] lg:h-auto lg:min-h-[640px]">
              <div className="absolute inset-0 bg-gradient-to-br from-cream/60 via-cream to-violet-tint" />
              <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(109,40,217,0.16)_1px,transparent_1px)] [background-size:22px_22px]" />
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent lg:w-28" />
              <Suspense
                fallback={
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.12),transparent_62%)]" />
                }
              >
                <HeroScene />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* FREE TOOLS — Prominent placement right after hero */}
      <section id="tools" className="border-t border-line bg-cream/30 py-20">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">Free Tools</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Start here. No call required.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Three self-serve diagnostics that show you exactly where you stand — before you spend a dollar.
                Each tool explains its limits. The scorecard shows temporary on-screen results; the SOC2 self-assessment offers a downloadable gap report.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FREE_TOOLS.map((tool) => (
                <FreeToolCard key={tool.to} tool={tool} />
              ))}
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
            {SERVICES.map((service, i) => (
              <ServiceRow key={service.id} service={service} index={i} />
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
