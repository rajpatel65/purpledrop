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
import { TeamCard } from '../components/TeamCard';
import { OutcomeCard } from '../components/OutcomeCard';
import { FreeToolCard } from '../components/FreeToolCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { TrustBadges } from '../components/TrustBadges';
import { MetricsBar } from '../components/MetricsBar';
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
    description: 'SSL, headers, email authentication, DNS, cookies — six foundations checked by a senior engineer. We email you the findings within one business day.',
    icon: SearchCheck,
    highlight: 'Free written verdict',
  },
  {
    to: '/calculator',
    label: 'AI Visibility Calculator',
    description: 'Three inputs, one instant dollar figure — built on the assumptions published on the page, with the logic shown before you get the number.',
    icon: Calculator,
    highlight: 'Revenue math',
  },
]

// Typing + proof + icon mapping for the four canonical services in content.ts.
const ICON_BY_ID: Record<string, 'shield' | 'zap' | 'boxes' | 'chart'> = {
  audit: 'shield',
  spendAudit: 'zap',
  optimization: 'boxes',
  tracking: 'chart',
};

const BADGE_BY_INDEX: Array<'popular' | 'value' | null> = [null, 'popular', 'value', null];

const CTA_BY_ID: Record<string, string> = {
  audit: 'Start the review',
  spendAudit: 'Find the savings',
  optimization: 'Discuss the build',
  tracking: 'Start the watch',
};

// What each engagement hands you — deliverables we control, not borrowed claims.
const PROOF_BY_ID: Record<string, string> = {
  audit:
    'You leave with a written report of exactly what the first conversation says about you — what\'s clear, what\'s missing, what\'s misunderstood. You keep it whichever way you decide.',
  spendAudit:
    'You leave with a written report of what you pay for, what\'s actually used, and where the overlaps are. Your report — whatever the findings.',
  optimization:
    'Deliverables are defined in writing before work starts. Your clarity work ships, then three months of monitoring are included so you can see movement.',
  tracking:
    'One page every month: what changed, why it changed, what to do next. The readouts are yours to keep. Cancel anytime.',
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

const FOUNDER = {
  name: 'Akshay Patel',
  title: 'Founder & Principal',
  bio: 'Every engagement is run personally: the review, the recommendations, the follow-through. You meet the founder — and the founder does the work.',
  linkedin: 'https://linkedin.com/in/akshaypatel',
};

// Best documented results — labeled with their basis, never presented as averages or promises.
const OUTCOMES = [
  { metric: '63%', label: 'the biggest rise in AI mentions we\'ve measured for one client within 90 days — shown in their readout, not promised here' },
  { metric: '40%', label: 'the highest share of software spend we\'ve found going to unused or duplicated tools in a single review — most reviews find less' },
  { metric: '3.2x', label: 'the largest savings-to-fee we\'ve documented in one Systems Efficiency Review — we measure savings, we don\'t promise them' },
  { metric: '98%', label: 'the share of Monthly Signal Watch clients who renewed after their first quarter' },
];

const FAQ_ITEMS = [
  {
    question: 'How does the $5K review save money?',
    answer: (
      <>
        <p className="mb-2">We map every subscription against actual usage — unused seats, duplicate tools, over-provisioned tiers. How much we find depends on your stack.</p>
        <p>For scale: in one review, 40% of software spend was going to tools that were barely used — the largest share we\'ve documented. Most reviews find less. You see the findings in your report before you decide anything.</p>
      </>
    ),
  },
  {
    question: 'What\'s in the monthly readout?',
    answer: (
      <>
        <p className="mb-2">One page: how you appear in the first conversation this month, what changed since last month, why it changed, and the one or two moves we\'d make next.</p>
        <p>No 40-page PDFs. A readout you can read in three minutes — and act on the same day.</p>
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
      <MetricsBar
        metrics={[
          { value: '3.1×', label: 'our best documented lift in a client\'s AI mentions — far end, not average' },
          { value: '6 of 10', label: 'clients shortlisted within their first quarter — ones we could make clear enough to describe' },
          { value: '1 business day', label: 'straight written answer to your enquiry — a standing commitment' },
          { value: '0', label: 'hourly billing — the price agreed in writing first' },
        ]}
      />

      {/* SERVICE GRID — 4 cards */}
      <section className="bg-cream/30 py-24 lg:py-32">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">The Work</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Four ways to bring clarity.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Fixed prices, published on this page. Senior-only. You keep every deliverable.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
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
                body="The strategist you meet in week 1 does the work in week 10. We don't staff up with juniors to hit a margin."
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
                Each one produces a deliverable you keep.
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

      {/* TEAM */}
      <section className="bg-paper py-20">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">The Team</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                You meet the founder.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                No associates. No handoffs. The person on the first call is the person
                doing the work.
              </p>
            </div>
            <div className="mx-auto max-w-md">
              {FOUNDER.name && (
                <TeamCard {...FOUNDER} index={0} />
              )}
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
                During an engagement you talk to the founder — however you prefer.
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
                title="cal.com/akshaypatel"
                body="Thirty minutes, booked directly. If the calendar looks empty, that's because capacity is deliberately limited."
                accent="gold"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* OUTCOMES / PROOF */}
      <section className="bg-paper py-20">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">Outcomes</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Our best days — labeled honestly.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Every number below is the far end of what we've documented — not averages,
                not promises. Your readouts will show your own numbers.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {OUTCOMES.map((outcome, i) => (
                <OutcomeCard key={outcome.metric} {...outcome} index={i} />
              ))}
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
        calendarEmbed
        calendarUrl="https://cal.com/akshaypatel"
      />
    </Layout>
  );
}
