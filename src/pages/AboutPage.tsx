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
    body: 'The number on the page is the number you pay. The scope and price are agreed in writing before work starts - so you always know what\'s being built and what it costs.',
  },
  {
    icon: Compass,
    title: 'Honest even when it costs us',
    body: 'If AI already describes you well, we\'ll tell you on the first call and send you on your way. Good work starts with a straight answer.',
  },
  {
    icon: Compass,
    title: 'Technical health matters',
    body: 'We distinguish public website checks from settings that need access. We explain what we could verify and what still needs checking. A public scan cannot prove that every plugin is current or that a website is secure.',
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
              Practical help for the business buyers should be finding.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              We help business owners understand how their business appears online and what
              needs attention. Start with an AI Visibility Review. Add a day together and
              follow-through if you want help turning the findings into a plan.
            </p>
            <img
              src="/images/about-ai-names.svg"
              alt="Names of AI assistants that can be included in an agreed review, including ChatGPT, Claude, Gemini, Copilot and Perplexity."
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
              What you can expect from us.
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
              time zones - the first call is always worth having face to face if we're nearby.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="card flex h-full flex-col justify-between p-8 md:p-10">
              <div>
                <p className="eyebrow">A note on how we got here</p>
                <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink">
                  Being good at your work is not enough if buyers cannot find you.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  A buyer may check a search engine, a map, a directory or an AI assistant.
                  We help you review the information they could find, so missing or confusing
                  details do not go unnoticed. No one can promise every buyer will see your name.
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
            <p className="eyebrow">Experience behind the work</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink">
              We've been the people making AI work inside companies.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Our background includes AI tools, training and sales workflows. This experience
              informs how we explain technical work. It is not evidence of client AI visibility
              results, and we do not present it as that.
            </p>
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Bot,
                title: 'Built AI agents, not experiments',
                body: 'Agents that automate competitor analysis, research, and the battle cards sales teams actually use - working tools, not proofs of concept.',
              },
              {
                icon: GraduationCap,
                title: 'Trained sales teams on ChatGPT, Claude & Gemini',
                body: 'Emails, research, outreach, call prep - taught until it stuck, with the workflows and prompts written down so nobody forgets.',
              },
              {
                icon: Headset,
                title: 'Automated the call analysis',
                body: 'Turned recorded sales and customer-service calls into CRM updates automatically - extracting competitors, objections, and call stories that fed discovery and demo scripts, with scorecards in Gong and Attention.',
              },
              {
                icon: PiggyBank,
                title: 'Audited the software stack',
                body: 'Analysed which purchased tools were actually used. The duplicates, the overlaps, the platforms nobody opened - and the money that went with them.',
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
              Clear findings. Agreed work. No promise we cannot support.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-cream/50 py-20">
        <div className="container-page max-w-3xl">
          <p className="eyebrow">Proof, not percentages</p>
          <h2 className="mt-4 font-serif text-4xl">Judge the findings, not a big claim.</h2>
          <p className="mt-6 text-lg text-ink-soft">A useful report shows the questions checked, dated answers, sources and limits. We do not publish client results or market statistics without supporting evidence. Ask how we record and compare the work.</p>
        </div>
      </section>

      <CtaBand
        title="Know what needs attention before you spend on fixes."
        body="Use a free 30-minute call to discuss your business and decide whether a review is useful. No obligation to continue."
        primaryLabel="Request a free 30-minute call"
        secondaryLabel="Read the essays"
        secondaryTo="/resources"
      />
    </Layout>
  );
}
