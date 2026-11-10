import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MessageSquare, ShieldCheck, Users, Bot, GraduationCap, Headset, PiggyBank } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { Breadcrumbs } from '../components/Breadcrumbs';

const VALUES = [
  {
    icon: Users,
    title: 'Senior-only, always',
    body: 'The people you meet are the people doing the work. We don\'t sell a senior name and deliver a junior. It\'s the easiest promise we make and the one we protect most.',
  },
  {
    icon: MessageSquare,
    title: 'Plain English, no exceptions',
    body: 'If we can\'t explain what we did in a sentence your whole team understands, we haven\'t finished. Jargon is how people hide work they can\'t defend.',
  },
  {
    icon: ShieldCheck,
    title: 'Fixed price, one written agreement',
    body: 'The number on the page is the number you pay. The scope and price are agreed in writing before work starts — so you always know what\'s being built and what it costs.',
  },
  {
    icon: Compass,
    title: 'Honest even when it costs us',
    body: 'If AI already describes you well, we\'ll tell you on the first call and send you on your way. Good work starts with a straight answer.',
  },
  {
    icon: Compass,
    title: 'Technical health matters',
    body: 'An outdated plugin or broken SEO today is the first answer AI gives tomorrow. We also check for outdated libraries, unmaintained dependencies, and SEO gaps — so your website doesn\'t let you down.',
  },
];

export function AboutPage() {
  useSeo(ROUTE_SEO['/about']);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">About purpleDrop</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              A small team that does this one thing properly.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              We help established companies get recommended by the AI tools their buyers now
              consult. Half our job is teaching that this is happening at all — most businesses,
              and their consultants, and their IT teams, simply don't know yet. The other half is
              the work itself.
            </p>
            <img
              src="/images/about-ai-names.svg"
              alt="A word map of the AI assistants purpleDrop clients get recommended by: ChatGPT, Claude, Gemini, Copilot, Perplexity, and more."
              className="mt-12 aspect-[16/9] w-full rounded-2xl border border-line bg-paper object-cover shadow-soft"
              loading="lazy"
            />
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-cream/50 py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">What we believe</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink">
              Four values you can hold us to.
            </h2>
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.06}>
                <div className="card h-full p-8">
                  <v.icon className="h-6 w-6 text-violet" />
                  <h3 className="mt-5 font-serif text-xl font-medium tracking-tight text-ink">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{v.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <FadeIn>
            <p className="eyebrow">Where we sit</p>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Based in the US. Working wherever your company is.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
              Most of our work is done remotely, in the open, on your tools. We work across all US
              time zones — the first call is always worth having face to face if we're nearby.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="card flex h-full flex-col justify-between p-8 md:p-10">
              <div>
                <p className="eyebrow">A note on how we got here</p>
                <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink">
                  We watched buyers stop searching and start asking.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  Every week, decisions that used to start on Google now start inside an AI answer.
                  Companies kept building websites for the old conversation. We built purpleDrop for
                  the new one — and for the companies that are still, quietly, absent from it.
                </p>
              </div>
              <Link to="/contact" className="btn-primary mt-8 self-start">
                Talk to us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Where we've actually done this</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink">
              We've been the people making AI work inside companies.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Before purpleDrop, we did this work from the inside — not as a slide deck, but as the
              person your team asked to "figure out this AI thing." Here's what we've actually
              built, trained, and run.
            </p>
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Bot,
                title: 'Built AI agents, not experiments',
                body: 'Agents that automate competitor analysis, research, and the battle cards sales teams actually use — working tools, not proofs of concept.',
              },
              {
                icon: GraduationCap,
                title: 'Trained sales teams on ChatGPT, Claude & Gemini',
                body: 'Emails, research, outreach, call prep — taught until it stuck, with the workflows and prompts written down so nobody forgets.',
              },
              {
                icon: Headset,
                title: 'Automated the call analysis',
                body: 'Turned recorded sales and customer-service calls into CRM updates automatically — extracting competitors, objections, and call stories that fed discovery and demo scripts, with scorecards in Gong and Attention.',
              },
              {
                icon: PiggyBank,
                title: 'Audited the software stack',
                body: 'Analysed which purchased tools were actually used. The duplicates, the overlaps, the platforms nobody opened — and the money that went with them.',
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.06}>
                <div className="card h-full p-8">
                  <item.icon className="h-6 w-6 text-violet" />
                  <h3 className="mt-5 font-serif text-xl font-medium tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.15}>
            <p className="mx-auto mt-12 max-w-3xl text-center font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
              "The business community isn't aware of what AI is doing to its buyers — and honestly,
              most consultants and IT teams aren't either. We've seen it from the inside. That's why
              we say it plainly."
            </p>
          </FadeIn>
        </div>
      </section>

      {/* THE EVIDENCE */}
      <section className="border-b border-line bg-cream/50 py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">The evidence</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              We&apos;re not the only ones saying this.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Four independent 2026 research reports confirm the same gap: buyers are
              using AI to make decisions — and most businesses, consultants, and IT
              teams haven&apos;t caught up.
            </p>
          </FadeIn>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {[
              {
                stat: '63%',
                body: 'of B2B buyers used AI during their purchase journey.',
                source: 'TrustRadius 2026 Buying Disconnect Report',
              },
              {
                stat: '68%',
                body: "of marketing leaders don't monitor their AI search results at all.",
                source: 'Gilroy 2026 — B2B Buyer Journeys in AI Search',
              },
              {
                stat: '50%',
                body: 'of professional services employees report no conversations with clients about AI.',
                source: 'Thomson Reuters 2026 — AI Guidance Gap',
              },
              {
                stat: '78%',
                body: 'of organizations lack confidence they could pass an AI governance audit.',
                source: 'Grant Thornton 2026 AI Impact Survey',
              },
            ].map((item, i) => (
              <FadeIn key={item.stat} delay={i * 0.06}>
                <div className="card h-full p-8">
                  <p className="font-serif text-5xl font-medium tracking-tight text-violet">{item.stat}</p>
                  <p className="mt-4 text-base leading-relaxed text-ink">{item.body}</p>
                  <p className="mt-4 text-xs text-ink-faint">{item.source}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="We're not an agency. We're a senior team that does one thing."
        body="Thirty minutes will tell you whether we're right for each other. No pitch, no pressure."
        primaryLabel="Request a free 30-minute call"
        secondaryLabel="Read the essays"
        secondaryTo="/resources"
      />
    </Layout>
  );
}
