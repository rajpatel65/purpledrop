import { useState } from 'react';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { Breadcrumbs } from '../components/Breadcrumbs';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwdqkbl';

const CHECKS = [
  {
    name: 'SSL/TLS Certificate',
    icon: Shield,
    what: 'Is your certificate valid, properly configured, and not expiring soon?',
    why: 'An expired or weak certificate triggers browser warnings and kills trust instantly. AI tools also flag insecure sites.',
  },
  {
    name: 'Security Headers',
    icon: Shield,
    what: 'CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy.',
    why: 'These headers tell browsers how to protect your visitors. Missing headers = vulnerable to injection, clickjacking, and data leaks.',
  },
  {
    name: 'Email Authentication',
    icon: Shield,
    what: 'SPF, DKIM, DMARC records configured correctly.',
    why: 'Without these, anyone can spoof your domain in emails. Phishing attacks impersonate you, and your deliverability drops.',
  },
  {
    name: 'Cookie Security',
    icon: Shield,
    what: 'HttpOnly, Secure, SameSite flags on all cookies.',
    why: 'Cookies without these flags can be stolen via XSS attacks or sent over unencrypted connections.',
  },
  {
    name: 'HTTPS Enforcement',
    icon: Shield,
    what: 'HTTP redirects to HTTPS, no mixed content.',
    why: 'If any part of your site loads over HTTP, attackers can intercept and modify traffic. Browsers punish this.',
  },
  {
    name: 'DNS Configuration',
    icon: Shield,
    what: 'MX, TXT, CAA records properly set.',
    why: 'Missing DNS records break email delivery, weaken authentication, and signal neglect to security scanners.',
  },
];

type FormState = 'idle' | 'sending' | 'done' | 'error';

export function ScorecardPage() {
  useSeo(ROUTE_SEO['/scorecard']);

  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !email || !consent) return;

    setState('sending');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `Security Scorecard Request: ${domain}`,
          domain,
          email,
          consent: true,
          type: 'scorecard',
        }),
      });

      if (!res.ok) throw new Error('Failed');
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Security Scorecard' }]} />
      {/* HERO */}
      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Free tool</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Security Scorecard
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              We check six security foundations that most teams miss — and that AI
              tools read when they evaluate your company.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FORM OR RESULTS */}
      <section className="border-b border-line bg-cream/50 py-24">
        <div className="container-page max-w-3xl">
          {state === 'done' ? (
            <FadeIn>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-tint">
                  <CheckCircle2 className="h-8 w-8 text-violet" />
                </div>
                <h2 className="mt-6 font-serif text-3xl font-medium tracking-tight text-ink">
                  We&apos;ll scan your site and send the results.
                </h2>
                <p className="mt-3 text-sm text-ink-soft">
                  Check your inbox within one business day. No spam, no sales sequence —
                  just the findings.
                </p>
              </div>

              {/* What we check — educational */}
              <div className="mt-12">
                <p className="eyebrow text-center">What we check</p>
                <h3 className="mt-4 text-center font-serif text-2xl font-medium text-ink">
                  Six foundations that keep your site secure and trustworthy.
                </h3>
                <div className="mt-8 space-y-4">
                  {CHECKS.map((check) => (
                    <div key={check.name} className="card p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-tint">
                          <check.icon className="h-5 w-5 text-violet" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{check.name}</p>
                          <p className="mt-1 text-xs text-ink-soft">{check.what}</p>
                          <p className="mt-2 text-xs leading-relaxed text-ink">{check.why}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 card p-8 text-center">
                <h3 className="font-serif text-2xl font-medium text-ink">
                  Security is the foundation. AI visibility is the next step.
                </h3>
                <p className="mt-3 text-sm text-ink-soft">
                  We check both for every client. Book a free call and we&apos;ll walk
                  you through what to fix first.
                </p>
                <a href="/contact" className="btn-primary mt-6 inline-flex">
                  Book a 30-minute call
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Run another */}
              <button
                onClick={() => { setState('idle'); setEmail(''); setDomain(''); setConsent(false); }}
                className="mt-6 w-full text-center text-sm text-ink-faint hover:text-ink"
              >
                Check another domain →
              </button>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="card p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-violet" />
                  <h2 className="font-serif text-2xl font-medium text-ink">Get your free scorecard</h2>
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  Enter your domain and email. We&apos;ll run a security scan and send you
                  the results within one business day.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="domain" className="mb-1.5 block text-sm font-medium text-ink">
                      Website URL <span className="text-violet">*</span>
                    </label>
                    <input
                      id="domain"
                      type="url"
                      required
                      placeholder="yourdomain.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value.replace(/^https?:\/\//, '').replace(/\/.*$/, ''))}
                      className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                    />
                  </div>
                  <div>
                    <label htmlFor="sc-email" className="mb-1.5 block text-sm font-medium text-ink">
                      Work email <span className="text-violet">*</span>
                    </label>
                    <input
                      id="sc-email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      id="consent"
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-line text-violet focus:ring-violet"
                    />
                    <label htmlFor="consent" className="text-xs leading-relaxed text-ink-soft">
                      I give permission to run a one-time security scan on my domain.
                      We&apos;ll never spam you. Results only.{' '}
                      <a href="/privacy" className="underline hover:text-ink">Privacy policy</a>.
                    </label>
                  </div>

                  {state === 'error' && (
                    <p className="text-sm text-red-600">Something went wrong. Please try again or email us directly.</p>
                  )}

                  <button
                    type="submit"
                    disabled={state === 'sending' || !domain || !email || !consent}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {state === 'sending' ? 'Sending…' : 'Get my scorecard'}
                    {state !== 'sending' && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs text-ink-faint">
                  One-time scan. No storage of your credentials. No spam.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <CtaBand
        title="Security is the foundation. AI visibility is the next step."
        body="We check both for every client. Thirty minutes, and you'll know where you stand."
        primaryLabel="Book a 30-minute call"
      />
    </Layout>
  );
}
