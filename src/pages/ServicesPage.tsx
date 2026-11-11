import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Shield, SearchCheck, Calculator, Users, Compass, BadgeCheck, Mail, Phone, CalendarDays } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ServiceCard } from '../components/ServiceCard';
import { FeatureCard } from '../components/FeatureCard';
import { FreeToolCard } from '../components/FreeToolCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { TrustBadges } from '../components/TrustBadges';
import { SERVICES, CONTACT } from '../lib/content';
import { PRICING } from '../lib/pricing';

const FREE_TOOLS = [
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
    label: 'AI Visibility Calculator',
    description: 'Three inputs, one instant dollar figure — built on the assumptions published on the page, with the logic shown before you get the number.',
    icon: Calculator,
    highlight: 'Revenue math',
  },
]

// One consulting offer, following a free introductory call.
const ICON_BY_ID: Record<string, 'shield' | 'zap' | 'boxes' | 'chart'> = { audit: 'shield', consultingDay: 'zap', consultingPlus: 'chart' };
const BADGE_BY_INDEX: Array<'popular' | 'value' | null> = [null, null, null];
const CTA_BY_ID: Record<string, string> = { audit: 'Request a free 30-minute call', consultingDay: 'Request a free 30-minute call', consultingPlus: 'Request a free 30-minute call' };
const PROOF_BY_ID: Record<string, string> = {
  audit: 'You keep the findings report.',
  consultingDay: 'Audit plus a full day fixing the top issues with you.',
  consultingPlus: 'The day plus 30 days of monitoring and adjustments.',
};

const SERVICE_CARDS = SERVICES.map((svc, i) => ({
  step: svc.step,
  title: svc.title,
  tag: svc.tagline,
  badge: BADGE_BY_INDEX[i],
  icon: ICON_BY_ID[svc.id],
  price: PRICING[svc.priceKey],
  timeline: svc.timeline,
  problem: svc.problem,
  outcome: svc.outcome,
  proof: PROOF_BY_ID[svc.id],
  bullets: svc.bullets,
  guarantee: svc.guarantee,
  ctaLabel: CTA_BY_ID[svc.id],
  ctaHref: '/contact',
}));

const FAQ_ITEMS = [
  {
    question: 'What do the options cost?',
    answer: (
      <>
        <p className="mb-2">The audit is $500. The audit plus a full consulting day is $2,000. The day plus 30 days of monitoring and adjustments is $3,000.</p>
        <p>The call is free, and the consulting day is optional. We agree on the focus before work starts.</p>
      </>
    ),
  },
  {
    question: 'What happens after the free call?',
    answer: (
      <>
        <p className="mb-2">You choose the level of support that fits: audit, consulting day, or day plus follow-through.</p>
        <p>The options are $500, $2,000 and $3,000. There is no obligation to continue.</p>
      </>
    ),
  },
]

export function ServicesPage() {
  useSeo(ROUTE_SEO['/services']);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />

      {/* HERO — Minimal */}
      <section className="bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Services</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              We bring clarity to AI chaos.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              When a buyer asks an AI system about your market, the first answer decides
              who gets the call. We review that conversation — then shape it so it
              describes you clearly, accurately, and first.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-primary">
                Request a free 30-minute call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/soc2" className="btn-outline">
                Start free: the SOC2 gap check
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHO WE WORK WITH + METRICS BAR */}
      <section className="border-y border-line py-12">
        <div className="container-page text-center">
          <FadeIn>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint mb-4">
              Who we work with
            </p>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-ink-soft">
              Founder-led and senior teams in professional services, software, finance,
              and healthcare — mostly in the US, UK, Canada, and Australia — who want
              a straight answer about where they stand.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SERVICE GRID — 4 cards */}
      <section className="bg-cream/30 py-24 lg:py-32">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">The Work</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Good, better, best. Your choice.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Start with a free 30-minute call. Choose an audit ($500), a consulting day ($2,000), or the day plus 30 days of follow-through ($3,000).
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 max-w-7xl mx-auto">
              {SERVICE_CARDS.map((svc, i) => (
                <ServiceCard key={svc.step} {...svc} index={i} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* HOW WE'RE DIFFERENT — 3 columns */}
      <section className="bg-paper py-24 lg:py-32">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">How we're different</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Three promises we keep.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <FeatureCard
                icon={Users}
                title="Senior-only, always"
                body="The person you meet on the call does the consulting work."
                accent="violet"
              />
              <FeatureCard
                icon={BadgeCheck}
                title="Fixed price, in writing"
                body={`The number on the page is the number you pay. No hourly billing, no "while we're in here" extras.`}
                accent="violet"
              />
              <FeatureCard
                icon={Compass}
                title="Honest even when it costs us"
                body="If AI already describes you well, we'll tell you on the first call and send you on your way."
                accent="gold"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* INLINE FAQs — Under Objections */}
      <section className="bg-cream/30 py-16 lg:py-24">
        <div className="container-page">
          <FadeIn>
            <FAQAccordion
              items={[
                {
                  question: 'Why senior-only? Can\'t juniors do this cheaper?',
                  answer: (
                    <p className="text-ink-soft">
                      Juniors follow playbooks. Senior strategists write them. AI governance requires judgment —
                      knowing which vendor clauses are negotiable, which governance gaps matter for your board,
                      and when to push back on a tool that looks secure but isn\'t. You pay for the calls you <em>don\'t</em> have to make twice.
                    </p>
                  ),
                },
                {
                  question: 'Fixed price sounds risky for you. What if scope creeps?',
                  answer: (
                    <p className="text-ink-soft">
                      We define scope in writing before we start. If you want more, we write a change order —
                      you approve the price before we do the work. No surprises. The number on the page is the number you pay.
                    </p>
                  ),
                },
              ]}
            />
          </FadeIn>
        </div>
      </section>

      {/* FREE TOOLS */}
      <section className="bg-cream/30 py-20">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">Free Tools</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Not ready to engage? Start here.
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

      {/* DIRECT CONTACT */}
      <section className="bg-cream/30 py-20">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">How we work together</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Direct lines, not ticket queues.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                During an engagement you talk directly to the person doing the work.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
              <FeatureCard
                icon={Mail}
                title={CONTACT.email}
                body="Written answers to straight questions — usually the same day, always within one business day."
                accent="violet"
              />
              <FeatureCard
                icon={Phone}
                title={CONTACT.phone}
                body="US business hours. If we're heads-down, we call you back — even if you don't chase us."
                accent="violet"
              />
              <FeatureCard
                icon={CalendarDays}
                title="Request a call"
                body="Use the contact form to arrange a free 30-minute call."
                accent="gold"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream/30 py-20">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">Straight answers</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                The questions buyers ask before they call.
              </h2>
            </div>
            <FAQAccordion items={FAQ_ITEMS} />
          </FadeIn>
        </div>
      </section>

      {/* TRUST BADGES + FINAL CTA */}
      <section className="bg-violet-deep py-20 text-white">
        <div className="container-page">
          <FadeIn>
            <TrustBadges />
          </FadeIn>
        </div>
      </section>

      <CtaBand
        title="Not sure where to start?"
        body="Thirty minutes. We show you what the first conversation says about you. You leave with a straight answer either way."
        primaryLabel="Request a free 30-minute call"
        secondaryLabel="Try the free SOC2 gap check"
        secondaryTo="/soc2"
      />
    </Layout>
  );
}
