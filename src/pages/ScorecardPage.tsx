import { useState, useEffect, useRef } from 'react';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { Breadcrumbs } from '../components/Breadcrumbs';

const FUNCTIONS_URL = `${(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')}/functions/v1`;

declare global { interface Window { turnstile?: { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void } } }
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
type CheckResult = { title: string; status: 'pass' | 'review' | 'unknown'; evidence: string[]; action: string };
type ScanReport = { domain: string; scannedAt: string; checks: CheckResult[] };
type FormState = 'idle' | 'requesting' | 'code' | 'verifying' | 'scanning' | 'done';

export function ScorecardPage() {
  useSeo(ROUTE_SEO['/scorecard']);
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [report, setReport] = useState<ScanReport | null>(null);
  const [expiresAt, setExpiresAt] = useState(0);
  const [remaining, setRemaining] = useState(600);
  const generation = useRef(0);
  const turnstileElement = useRef<HTMLDivElement>(null);
  const [botToken, setBotToken] = useState('');
  const reset = (message = '') => { generation.current++; setReport(null); setChallenge(''); setCode(''); setState('idle'); setError(message); setExpiresAt(0); };

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || state !== 'idle') return;
    let widget: string | undefined;
    const render = () => { if (turnstileElement.current && window.turnstile) widget = window.turnstile.render(turnstileElement.current, {sitekey: TURNSTILE_SITE_KEY, action: 'scorecard', callback: (token: string) => setBotToken(token), 'expired-callback': () => setBotToken(''), 'error-callback': () => setBotToken('')}); };
    let script = document.querySelector<HTMLScriptElement>('script[data-scorecard-turnstile]');
    if (window.turnstile) render();
    else { if (!script) { script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.dataset.scorecardTurnstile = 'true'; document.head.appendChild(script); } script.addEventListener('load', render); }
    return () => { script?.removeEventListener('load', render); if (widget && window.turnstile) window.turnstile.remove(widget); setBotToken(''); };
  }, [state]);

  useEffect(() => {
    const clear = () => { if (state === 'done' || state === 'scanning') reset('Your one-time results were cleared. Request a fresh code to run another check.'); };
    const hidden = () => { if (document.hidden) clear(); };
    const tick = window.setInterval(() => { if (expiresAt) { const left = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)); setRemaining(left); if (left === 0) reset('Your results expired. Request a fresh code to run another check.'); } }, 1000);
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('pagehide', clear);
    return () => { clearInterval(tick); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('pagehide', clear); };
  }, [state, expiresAt]);
  useEffect(() => () => { generation.current++; }, []);

  const call = async (path: string, data: Record<string, unknown>) => {
    const response = await fetch(`${FUNCTIONS_URL}/${path}`, { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Request failed. Please try again later.');
    return result;
  };
  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault(); if (!email || !domain || !consent) return;
    setError(''); setState('requesting');
    try { const result = await call('send-verification', { purpose: 'scorecard', email, domain, consent, turnstile_token: botToken }); setChallenge(result.challenge_id); setState('code'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not send code.'); setState('idle'); }
  };
  const runCheck = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setState('verifying'); const current = generation.current;
    try {
      const verified = await call('verify-code', { purpose: 'scorecard', challenge_id: challenge, code });
      if (generation.current !== current) return;
      setState('scanning');
      const result = await call('website-scorecard', { challenge_id: challenge, scan_token: verified.scan_token });
      if (generation.current !== current) return;
      setReport(result.report); setExpiresAt(Date.parse(result.expires_at)); setRemaining(600); setState('done'); setCode(''); setChallenge('');
    } catch (err) { if (generation.current !== current) return; setError(err instanceof Error ? err.message : 'Could not run check.'); setState('code'); }
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
              Check six security foundations in your public homepage and DNS. Verify
              your email, then see the findings and next steps here.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FORM OR RESULTS */}
      <section className="border-b border-line bg-cream/50 py-24">
        <div className="container-page max-w-3xl">
          {state === 'done' && report ? (
            <FadeIn>
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-violet" />
                <p className="eyebrow mt-5">Your one-time check</p>
                <h2 className="mt-4 break-all font-serif text-3xl text-ink">{report.domain}</h2>
                <p className="mt-3 text-sm text-ink-soft">Checked {new Date(report.scannedAt).toLocaleString()}. Results clear in {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}.</p>
                <p className="mt-2 text-xs text-ink-soft">Leaving this page or switching tabs clears these results. Reloading cannot restore them. Anything already displayed can still be copied or captured.</p>
              </div>
              <div className="mt-8 space-y-4">
                {report.checks.map(check => (
                  <div key={check.title} className="card p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold text-ink">{check.title}</h3>
                      <span className="rounded-full bg-violet-tint px-3 py-1 text-xs font-semibold text-violet">{check.status === 'pass' ? 'Observed' : check.status === 'review' ? 'Review' : 'Unverified'}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{check.action}</p>
                    <details className="mt-3 text-xs text-ink-soft"><summary className="cursor-pointer py-2 font-medium">What we observed</summary><ul className="space-y-2">{check.evidence.map((line, i) => <li key={i} className="break-words">{line}</li>)}</ul></details>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-ink-soft">Observed means the tested condition was seen, not that the site is secure. Review needs context. Unverified needs another check. This is an automated homepage and DNS check, not a penetration test or a full-site audit.</p>
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
                  Request a free 30-minute call
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Run another */}
              <button
                onClick={() => reset()}
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
                <p className="mt-3 text-sm text-ink-soft">Verify your email, then see six simple checks on this page. No report email or download. Results clear after 10 minutes or when you leave.</p>
                {state === 'code' || state === 'verifying' || state === 'scanning' ? (
                  <form onSubmit={runCheck} className="mt-8 space-y-5">
                    <p className="text-sm text-ink-soft">We sent a six-digit code to {email}. It expires in 10 minutes. Three incorrect attempts block verification for 15 minutes.</p>
                    <label htmlFor="scorecard-code" className="block text-sm font-medium">Verification code</label>
                    <input id="scorecard-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} disabled={state !== 'code'} className="w-full rounded-xl border border-line bg-paper px-4 py-3 tracking-widest" />
                    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={state !== 'code' || code.length !== 6} className="btn-primary w-full disabled:opacity-60">{state === 'scanning' ? 'Checking your website...' : state === 'verifying' ? 'Verifying...' : 'Verify and run check'}</button>
                    {state === 'code' && <button type="button" onClick={() => reset()} className="w-full py-3 text-sm text-ink-soft">Start again with a fresh code</button>}
                  </form>
                ) : (
                  <form onSubmit={requestCode} className="mt-8 space-y-5">
                    <div><label htmlFor="domain" className="mb-1.5 block text-sm font-medium text-ink">Website URL</label><input id="domain" type="text" inputMode="url" required maxLength={300} placeholder="yourdomain.com" value={domain} onChange={e => setDomain(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm" /></div>
                    <div><label htmlFor="sc-email" className="mb-1.5 block text-sm font-medium text-ink">Work email</label><input id="sc-email" type="email" required maxLength={254} placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm" /></div>
                    <div className="flex items-start gap-3"><input id="consent" type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 h-4 w-4" /><label htmlFor="consent" className="text-xs leading-relaxed text-ink-soft">I give permission for a one-time security check on this domain and a verification code by email. Results only, no sales sequence. <a href="/privacy" className="underline">Privacy policy</a>.</label></div>
                    {TURNSTILE_SITE_KEY && <div ref={turnstileElement} className="min-h-16" />}
                    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={(!!TURNSTILE_SITE_KEY && !botToken) || state === 'requesting' || !email || !domain || !consent} className="btn-primary w-full disabled:opacity-60">{state === 'requesting' ? 'Sending verification code...' : 'Send verification code'}<ArrowRight className="h-4 w-4" /></button>
                  </form>
                )}
                <p className="mt-4 text-center text-xs text-ink-faint">
                  One-time public homepage and DNS check. Not a penetration test. No spam.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <CtaBand
        title="Security is the foundation. AI visibility is the next step."
        body="We check both for every client. Thirty minutes, and you'll know where you stand."
        primaryLabel="Request a free 30-minute call"
      />
    </Layout>
  );
}
