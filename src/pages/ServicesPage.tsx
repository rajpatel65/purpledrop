import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, SearchCheck, Calculator, Users, Compass, BadgeCheck, Mail, CalendarCheck, CalendarDays } from 'lucide-react';
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
    to: '/scorecard',
    label: 'Security Scorecard',
    description: 'Verify your email with a code, then view six automated public checks on screen. Results last up to 10 minutes and clear when you leave or switch tabs. No report is emailed.',
    icon: SearchCheck,
    highlight: 'Instant on-screen checks',
  },
  {
    to: '/calculator',
    label: 'Lead Value Calculator',
    description: 'Use your own leads, close rate, sale value and extra-lead scenario. This is a planning estimate, not a forecast or measurement of lost sales.',
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
  consultingDay: 'Review plus a day with you to agree priorities and next steps.',
  consultingPlus: 'Review, meeting day and 30 days of monitoring and agreed adjustments.',
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
        <p className="mb-2">AI Visibility Review: $1,200. Review + Planning Day: $2,500. Planning Day + 30-Day Support: $4,500.</p>
        <p>The call is free. The Planning Day is a day with you, not a promise that every fix is finished that day. Scope and completion dates are agreed in writing.</p>
      </>
    ),
  },
  {
    question: 'What happens after the free call?',
    answer: (
      <>
        <p className="mb-2">Choose a review report, the review plus a day together, or both with 30 days of support.</p>
        <p>The options are $1,200, $2,500 and $4,500. There is no obligation to continue.</p>
      </>
    ),
  },
]

export function ServicesPage() {
  useSeo(ROUTE_SEO['/services']);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />

      {/* HERO - Minimal */}
      <section className="bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Services</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Find the gaps. Choose the help you need.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              If buyers cannot find your business or understand what you offer, they may contact
              someone else. We review how your business appears in AI answers, on your website
              and in public listings, then help you decide what to fix first.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-primary">
                Request a free 30-minute call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/scorecard" className="btn-outline">
                Start free: the security scorecard
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
              Business owners who want to know whether people can find, understand and contact
              their business online. We start with your services, your location and the customers
              you want to reach.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SERVICE GRID - 4 cards */}
      <section className="bg-cream/30 py-24 lg:py-32">
        <div className="container-page">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="eyebrow">The Work</p>
              <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                A report. A day together. Support afterward.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Each option starts with the AI Visibility Review. Add a day with us to decide the work, then 30 days of support if you want help following through.
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

      <section id="website-and-security" className="border-y border-line bg-paper py-20">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <div className="card p-8"><h2 className="font-serif text-3xl">Is your website dated?</h2>
            <p className="mt-4 text-ink-soft">We review how your website looks and works for customers. If a redesign is needed, it is a separate project, quoted from $5,000. Page count, content and e-commerce affect the quote.</p></div>
          <div className="card p-8"><h2 className="font-serif text-3xl">Want a security configuration review?</h2>
            <p className="mt-4 text-ink-soft">This is paid work with its own agreed scope and price. We review the settings we can verify and explain the gaps. It is not a penetration test, certification or guarantee that your site is secure.</p></div>
        </div>
      </section>

      {/* HOW WE'RE DIFFERENT - 3 columns */}
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
                body="Work with the person you meet on the call."
                accent="violet"
              />
              <FeatureCard
                icon={BadgeCheck}
                title="Fixed price, in writing"
                body={`Your written scope states the included work and fixed price. Extra work needs your approval.`}
                accent="violet"
              />
              <FeatureCard
                icon={Compass}
                title="Honest even when it costs us"
                body="If the review does not support more work, we will say so. You keep the findings either way."
                accent="gold"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* INLINE FAQs - Under Objections */}
      <section className="bg-cream/30 py-16 lg:py-24">
        <div className="container-page">
          <FadeIn>
            <FAQAccordion
              items={[
                {
                  question: 'Who does the work?',
                  answer: (
                    <p className="text-ink-soft">
                      You work directly with the person who reviews your business. We explain the findings,
                      agree priorities with you and stay responsible for the work in your scope.
                    </p>
                  ),
                },
                {
                  question: 'What if more work is needed?',
                  answer: (
                    <p className="text-ink-soft">
                      We agree the work and price in writing first. If the review uncovers more work, we explain it
                      and quote it separately. Nothing extra starts without your approval.
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
                The scorecard checks a few public security settings. The calculator explores lead value using your numbers.
                Neither replaces the paid AI Visibility Review or a security configuration review.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
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
                body="Send questions or request a free call. We aim to reply within one business day."
                accent="violet"
              />
              <FeatureCard
                icon={CalendarCheck}
                title="Book a time directly"
                body="Use the calendar link on our contact page to see available times for a free 30-minute call."
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
        body="Use the free call to discuss your business and choose a next step. The detailed review and report are paid work."
        primaryLabel="Request a free 30-minute call"
        secondaryLabel="Try the free security scorecard"
        secondaryTo="/scorecard"
      />
    </Layout>
  );
              }
