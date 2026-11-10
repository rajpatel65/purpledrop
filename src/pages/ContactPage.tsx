import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, Lock, Search, ShieldCheck, PhoneCall } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { FaqList } from '../components/PricingTable';
import { contactFaqs } from '../lib/faqs';
import { CONTACT } from '../lib/content';
import { JsonLd } from '../components/JsonLd';
import { faqSchema } from '../lib/schema';
import { Breadcrumbs } from '../components/Breadcrumbs';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwdqkbl';

const TRUST = [
  { icon: Clock, label: 'Response within one business day' },
  { icon: ShieldCheck, label: 'Senior strategist reads every enquiry' },
  { icon: Lock, label: 'Confidential — NDAs on request' },
];

const initialForm = { name: '', email: '', company: '', interest: '', message: '', _honey: '' };

export function ContactPage() {
  useSeo(ROUTE_SEO['/contact']);

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form._honey) return;
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          interest: form.interest,
          message: form.message,
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none';

  return (
    <Layout>
      <JsonLd data={faqSchema(contactFaqs)} />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Contact</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Let's find out what AI says about you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              A free 30-minute call. No pitch deck, no pressure. You leave with a straight answer about
              where you stand — whether we ever work together or not.
            </p>
          </FadeIn>

          <div className="mt-8 flex flex-wrap gap-4">
            {TRUST.map((t) => (
              <div key={t.label} className="flex items-center gap-2 rounded-full border border-line bg-cream/50 px-4 py-2 text-sm text-ink-soft">
                <t.icon className="h-4 w-4 text-violet" />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-cream/40 py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <FadeIn>
            <div>
              <p className="eyebrow">What happens next</p>
              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink">
                Three things, in order.
              </h2>
              <ol className="mt-8 space-y-6">
                <li className="flex gap-4">
                  <span className="font-serif text-2xl font-medium text-violet">1</span>
                  <div>
                    <h3 className="font-semibold text-ink">We read it</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      A senior strategist — not a bot — reads what you send and replies within one
                      business day.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-serif text-2xl font-medium text-violet">2</span>
                  <div>
                    <h3 className="font-semibold text-ink">We show you the answer</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      We run the questions your buyers actually ask — live, on a shared screen,
                      across ChatGPT, Gemini, Claude, Perplexity, and Copilot. You watch what they
                      say about your company and your competitors appear in real time, and you keep
                      the findings either way. You'll also immediately see whether your website's
                      public foundations (plugins, SEO, design) are solid — or whether they're letting
                      gaps show.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-serif text-2xl font-medium text-violet">3</span>
                  <div>
                    <h3 className="font-semibold text-ink">You decide</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      After the free call, choose an audit ($500), the consulting day ($2,000), or the day plus 30 days of follow-through ($3,000).
                      We agree on the focus first. There is no obligation to continue.
                    </p>
                  </div>
                </li>
              </ol>
              <p className="mt-10 flex items-center gap-2 text-sm text-ink-soft">
                <Search className="h-4 w-4 text-violet" />
                Or email us at{' '}
                <a href={`mailto:${CONTACT.email}`} className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                  {CONTACT.email}
                </a>
              </p>
              <a
                href={`tel:${CONTACT.phone}`}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-cream/50 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-violet"
              >
                <PhoneCall className="h-4 w-4 text-violet" />
                Prefer to talk? Call us on {CONTACT.phone}
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="card p-8 md:p-10">
              {status === 'done' ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-tint">
                    <Check className="h-8 w-8 text-violet" />
                  </div>
                  <h2 className="mt-6 font-serif text-3xl font-medium tracking-tight text-ink">
                    Your call request is sent.
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
                    We will reply within one business day to arrange your free 30-minute call.
                    Your call is not booked yet.
                  </p>
                  <Link to="/" className="btn-outline mt-8">
                    Back to home
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-sm leading-relaxed text-ink-soft">
                    Request your free 30-minute call below. We will email you to arrange a time.
                  </p>
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                      Name <span className="text-violet">*</span>
                    </label>
                    <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                      Email <span className="text-violet">*</span>
                    </label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-ink">
                      Company
                    </label>
                    <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Your company" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="interest" className="mb-1.5 block text-sm font-medium text-ink">
                      What are you interested in?
                    </label>
                    <select id="interest" name="interest" value={form.interest} onChange={handleChange} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="audit">AI-visibility audit - $500</option>
                      <option value="consultingDay">Consulting day - $2,000</option>
                      <option value="consultingPlus">Day plus 30 days of follow-through - $3,000</option>
                      <option value="unsure">Not sure yet — tell me where we stand</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
                      Anything we should know? <span className="text-ink-faint">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="A sentence or two about your situation. Plain English is fine — or skip this and we'll learn it on the call."
                      className={inputClass}
                    />
                    <p className="mt-2 text-xs text-ink-faint">
                      Just want the call? Skip this — we'll cover it in thirty minutes.
                    </p>
                  </div>
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="honey">Leave this field empty</label>
                    <input id="honey" name="_honey" value={form._honey} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                  </div>
                  <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-60">
                    {status === 'sending' ? 'Sending…' : 'Request a free 30-minute call'}
                    {status !== 'sending' && <ArrowRight className="h-4 w-4" />}
                  </button>
                  {status === 'error' && (
                    <p className="text-center text-sm text-red-700">
                      Something went wrong. Please email us at {CONTACT.email} instead.
                    </p>
                  )}
                  <p className="text-center text-xs leading-relaxed text-ink-faint">
                    By submitting, you agree to our{' '}
                    <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">
                      privacy policy
                    </Link>
                    . No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Before you write</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink">
              The questions people ask first.
            </h2>
          </FadeIn>
          <div className="mt-10">
            <FaqList items={contactFaqs} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
