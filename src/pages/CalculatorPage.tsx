import { useState, useMemo } from 'react';
import { TrendingDown, TrendingUp, ArrowRight, DollarSign, BarChart3 } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { CtaBand } from '../components/CtaBand';
import { Breadcrumbs } from '../components/Breadcrumbs';

const LEAD_ENDPOINT = `${(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')}/functions/v1/submit-lead`;

const fmt = (n: number) =>
  n >= 1000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : n >= 1000
      ? `$${(n / 1000).toFixed(0)}K`
      : `$${Math.round(n).toLocaleString()}`;

const fmtNum = (n: number) => Math.round(n).toLocaleString();

type FormState = 'idle' | 'sending' | 'done' | 'error';

export function CalculatorPage() {
  useSeo(ROUTE_SEO['/calculator']);

  const [traffic, setTraffic] = useState('10000');
  const [conversion, setConversion] = useState('2.0');
  const [ltv, setLtv] = useState('500');
  const [spend, setSpend] = useState('3000');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>('idle');
  const [showResults, setShowResults] = useState(false);

  const calc = useMemo(() => {
    const t = parseFloat(traffic) || 0;
    const cr = (parseFloat(conversion) || 2) / 100;
    const value = parseFloat(ltv) || 0;
    const budget = parseFloat(spend) || 0;

    // Benchmarks based on 2025/2026 AI Search data
    const traditionalLossRate = 0.35; // 35% of organic clicks lost to AI overviews (conservative B2B estimate)
    const geoConversionMultiplier = 2.1; // GEO-cited traffic converts 2.1x better than organic (more targeted intent)
    const geoRecaptureRate = 0.30; // 30% of lost traffic recaptured via GEO citations

    // Current state
    const currentMonthlyLeads = t * cr;
    const currentMonthlyRevenue = currentMonthlyLeads * value;
    const currentAnnualRevenue = currentMonthlyRevenue * 12;
    const costPerLead = budget / (currentMonthlyLeads || 1);

    // SEO loss calculations
    const trafficLostMonthly = t * traditionalLossRate;
    const leadsLostMonthly = trafficLostMonthly * cr;
    const revenueLostMonthly = leadsLostMonthly * value;
    const revenueLostAnnual = revenueLostMonthly * 12;

    // GEO opportunity calculations
    const geoTrafficRecaptured = trafficLostMonthly * geoRecaptureRate;
    const geoLeadsMonthly = geoTrafficRecaptured * cr * geoConversionMultiplier;
    const geoRevenuePotentialMonthly = geoLeadsMonthly * value;
    const geoRevenuePotentialAnnual = geoRevenuePotentialMonthly * 12;

    // Net impact
    const netAnnualLoss = revenueLostAnnual - geoRevenuePotentialAnnual;

    // ROI of GEO
    const geoCostEstimate = budget * 0.4; // GEO typically costs ~40% of existing SEO budget
    const geoROI = geoRevenuePotentialAnnual / (geoCostEstimate || 1);

    return {
      currentMonthlyLeads,
      currentMonthlyRevenue,
      currentAnnualRevenue,
      costPerLead,
      trafficLostMonthly,
      leadsLostMonthly,
      revenueLostMonthly,
      revenueLostAnnual,
      geoTrafficRecaptured,
      geoLeadsMonthly,
      geoRevenuePotentialMonthly,
      geoRevenuePotentialAnnual,
      netAnnualLoss,
      geoCostEstimate,
      geoROI,
    };
  }, [traffic, conversion, ltv, spend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;

    setState('sending');

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: 'calculator',
          email,
          traffic,
          conversion,
          ltv,
          spend,
          revenueLost: fmtNum(calc.revenueLostAnnual),
        }),
      });

      if (!res.ok) throw new Error('Failed');
      setState('done');
      setShowResults(true);
    } catch {
      setState('error');
    }
  };

  const allFilled = traffic && conversion && ltv && spend;

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'AI Visibility Calculator' }]} />
      {/* HERO */}
      <section className="border-b border-line bg-paper py-24">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Free tool</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              What is AI costing you?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Buyers are shifting from Google to ChatGPT, Gemini, and Perplexity.
              See what that means for your revenue — and what GEO optimization could
              recapture.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* HOW THE NUMBERS WORK */}
      <section className="border-b border-line bg-paper py-20">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">The logic &amp; benchmarks</p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
              Three published assumptions, applied to your inputs.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              No black box. The calculator applies current 2025/2026 AI-search
              benchmarks — reflecting the ongoing shift of buyers from traditional
              search engines toward AI tools like ChatGPT, Gemini, and Perplexity —
              to your own numbers. In plain English: it estimates what traffic and
              revenue you may be losing to that shift (your risk), and what optimizing
              for Generative Engine Optimization (GEO) could help you recapture (your
              opportunity).
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FadeIn>
              <div className="h-full rounded-2xl border border-line bg-cream/50 p-7">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-violet">
                  1 · Where your buyers went
                </p>
                <h3 className="mt-3 font-serif text-xl font-medium text-ink">
                  The shift is quiet, and it&apos;s already underway.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  A growing share of B2B buying starts with a question typed into an AI
                  assistant instead of a search engine. The buyer gets a short, confident
                  list and acts on it — no click, no visit, no trace in your analytics.
                  We apply the cautious 2025/2026 benchmark: <strong>35% of traditional
                  organic clicks</strong> have been pulled away by AI-generated answers.
                  Some published studies run higher; we stay conservative.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="h-full rounded-2xl border border-line bg-cream/50 p-7">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-violet">
                  2 · Your risk
                </p>
                <h3 className="mt-3 font-serif text-xl font-medium text-ink">
                  What the shift silently costs.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Lost traffic × your conversion rate × your average customer value.
                  That&apos;s the revenue estimated to slip away each year the shift
                  continues. Nothing breaks, no report flags it — the buyer simply asks
                  someone else, and the AI answer names companies that are easier to
                  describe than yours.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.16}>
              <div className="h-full rounded-2xl border border-line bg-cream/50 p-7">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-violet">
                  3 · Your opportunity
                </p>
                <h3 className="mt-3 font-serif text-xl font-medium text-ink">
                  What GEO can win back.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  GEO means making your company the one AI can describe completely and
                  accurately — so you become the recommendation. We model a cautious{' '}
                  <strong>30% of lost traffic recaptured</strong>, converting{' '}
                  <strong>2.1× better</strong> than ordinary organic (buyers who arrive
                  on an AI recommendation come pre-qualified). The GEO work itself is
                  estimated at roughly 40% of what you spend on SEO today.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.08}>
            <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-faint">
              These are planning estimates for a conversation — not forecasts, and not a
              promise. On the call we run the live checks against your actual site, sources,
              and competitors, and replace every assumption above with numbers you can see
              on the screen. If reality beats the model, you&apos;ll see exactly why.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FORM + RESULTS */}
      <section className="border-b border-line bg-cream/50 py-24">
        <div className="container-page max-w-3xl">
          {showResults ? (
            <FadeIn>
              {/* Headline */}
              <div className="text-center">
                <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">Your numbers</p>
                <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                  {fmt(calc.netAnnualLoss)} net annual impact
                </h2>
                <p className="mt-4 text-lg text-ink-soft">
                  Here&apos;s what the shift from Google to AI means for your business.
                </p>
              </div>

              {/* Current State */}
              <div className="mt-12 card p-8">
                <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">Current state</p>
                <div className="mt-4 grid gap-6 sm:grid-cols-3">
                  <div>
                    <p className="font-serif text-3xl font-medium text-ink">{fmtNum(calc.currentMonthlyLeads)}</p>
                    <p className="mt-1 text-xs text-ink-soft">Monthly leads from organic</p>
                  </div>
                  <div>
                    <p className="font-serif text-3xl font-medium text-ink">{fmt(calc.currentAnnualRevenue)}</p>
                    <p className="mt-1 text-xs text-ink-soft">Annual organic revenue</p>
                  </div>
                  <div>
                    <p className="font-serif text-3xl font-medium text-ink">{fmt(calc.costPerLead)}</p>
                    <p className="mt-1 text-xs text-ink-soft">Cost per lead</p>
                  </div>
                </div>
              </div>

              {/* SEO Loss */}
              <div className="mt-6 card p-8 border-red-200 bg-red-50/50">
                <div className="flex items-start gap-4">
                  <TrendingDown className="mt-1 h-6 w-6 flex-shrink-0 text-red-500" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-red-600">SEO revenue at risk</p>
                    <div className="mt-4 grid gap-6 sm:grid-cols-3">
                      <div>
                        <p className="font-serif text-3xl font-medium text-red-600">{fmtNum(calc.trafficLostMonthly)}</p>
                        <p className="mt-1 text-xs text-red-600/80">Monthly clicks lost to AI</p>
                      </div>
                      <div>
                        <p className="font-serif text-3xl font-medium text-red-600">{fmtNum(calc.leadsLostMonthly)}</p>
                        <p className="mt-1 text-xs text-red-600/80">Monthly leads lost</p>
                      </div>
                      <div>
                        <p className="font-serif text-3xl font-medium text-red-600">{fmt(calc.revenueLostAnnual)}</p>
                        <p className="mt-1 text-xs text-red-600/80">Annual revenue at risk</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-red-600/80">
                      Based on the 2025/2026 benchmark that ~35% of traditional organic
                      clicks are lost to AI-generated answers — the conservative end of
                      published B2B studies. This is the shift itself, not a penalty:
                      your buyers are increasingly asking an AI who to call, and that
                      answer never mentions a click. It names companies directly, and if
                      yours isn&apos;t in it, the visit never happens.
                    </p>
                  </div>
                </div>
              </div>

              {/* GEO Opportunity */}
              <div className="mt-6 card p-8 border-green-200 bg-green-50/50">
                <div className="flex items-start gap-4">
                  <TrendingUp className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-green-700">GEO opportunity</p>
                    <div className="mt-4 grid gap-6 sm:grid-cols-3">
                      <div>
                        <p className="font-serif text-3xl font-medium text-green-700">{fmtNum(calc.geoTrafficRecaptured)}</p>
                        <p className="mt-1 text-xs text-green-700/80">Monthly traffic recaptured</p>
                      </div>
                      <div>
                        <p className="font-serif text-3xl font-medium text-green-700">{fmtNum(calc.geoLeadsMonthly)}</p>
                        <p className="mt-1 text-xs text-green-700/80">Monthly leads generated</p>
                      </div>
                      <div>
                        <p className="font-serif text-3xl font-medium text-green-700">{fmt(calc.geoRevenuePotentialAnnual)}</p>
                        <p className="mt-1 text-xs text-green-700/80">Annual revenue potential</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-green-700/80">
                      GEO-cited traffic converts 2.1× better than organic — the AI has
                      already done the qualification, so the buyer arrives convinced
                      rather than browsing. We stay cautious and assume 30% of lost
                      traffic can be recaptured; in practice, results tend to run higher
                      when your company is the most clearly describable in your category.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-10 card p-8">
                <div className="flex items-start gap-4">
                  <BarChart3 className="mt-1 h-6 w-6 flex-shrink-0 text-violet" />
                  <div>
                    <h3 className="font-serif text-xl font-medium text-ink">What this means</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      Without GEO optimization, you&apos;re losing an
                      estimated <strong>{fmt(calc.revenueLostAnnual)}/yr</strong> as buyers
                      shift to AI. With GEO, you could
                      recapture <strong>{fmt(calc.geoRevenuePotentialAnnual)}/yr</strong> —
                      a net swing of <strong>{fmt(calc.netAnnualLoss)}/yr</strong>.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      GEO typically costs ~40% of your existing SEO budget.
                      At <strong>{fmt(calc.geoROI)}x ROI</strong>, it&apos;s the highest-leverage
                      investment you can make right now.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 text-center">
                <a href="/contact" className="btn-primary inline-flex">
                  Request a free 30-minute call
                  <ArrowRight className="h-4 w-4" />
                </a>
                <p className="mt-3 text-xs text-ink-faint">
                  We&apos;ll verify the real numbers and show you exactly where to start.
                </p>
              </div>

              {/* Run another */}
              <button
                onClick={() => { setShowResults(false); setEmail(''); setConsent(false); setState('idle'); }}
                className="mt-8 w-full text-center text-sm text-ink-faint hover:text-ink"
              >
                Calculate for another business →
              </button>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="card p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-violet" />
                  <h2 className="font-serif text-2xl font-medium text-ink">Calculate your risk & opportunity</h2>
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  Enter your numbers. We&apos;ll show you what AI is costing you — and
                  what GEO optimization could recapture.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="traffic" className="mb-1.5 block text-sm font-medium text-ink">
                        Monthly organic traffic <span className="text-violet">*</span>
                      </label>
                      <input
                        id="traffic"
                        type="number"
                        required
                        min="0"
                        placeholder="10000"
                        value={traffic}
                        onChange={(e) => setTraffic(e.target.value)}
                        className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                      />
                    </div>
                    <div>
                      <label htmlFor="conversion" className="mb-1.5 block text-sm font-medium text-ink">
                        Website conversion rate (%) <span className="text-violet">*</span>
                      </label>
                      <input
                        id="conversion"
                        type="number"
                        required
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="2.0"
                        value={conversion}
                        onChange={(e) => setConversion(e.target.value)}
                        className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                      />
                    </div>
                    <div>
                      <label htmlFor="ltv" className="mb-1.5 block text-sm font-medium text-ink">
                        Average customer value ($) <span className="text-violet">*</span>
                      </label>
                      <input
                        id="ltv"
                        type="number"
                        required
                        min="0"
                        placeholder="500"
                        value={ltv}
                        onChange={(e) => setLtv(e.target.value)}
                        className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                      />
                    </div>
                    <div>
                      <label htmlFor="spend" className="mb-1.5 block text-sm font-medium text-ink">
                        Monthly SEO/marketing budget ($) <span className="text-violet">*</span>
                      </label>
                      <input
                        id="spend"
                        type="number"
                        required
                        min="0"
                        placeholder="3000"
                        value={spend}
                        onChange={(e) => setSpend(e.target.value)}
                        className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="calc-email" className="mb-1.5 block text-sm font-medium text-ink">
                      Work email <span className="text-violet">*</span>
                    </label>
                    <input
                      id="calc-email"
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
                      id="calc-consent"
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-line text-violet focus:ring-violet"
                    />
                    <label htmlFor="calc-consent" className="text-xs leading-relaxed text-ink-soft">
                      Send me the results and occasional insights about AI visibility.
                      No spam, ever.{' '}
                      <a href="/privacy" className="underline hover:text-ink">Privacy policy</a>.
                    </label>
                  </div>

                  {state === 'error' && (
                    <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
                  )}

                  <button
                    type="submit"
                    disabled={!allFilled || !email || !consent || state === 'sending'}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {state === 'sending' ? 'Sending…' : 'Show me my numbers'}
                    {state !== 'sending' && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs text-ink-faint">
                  Built on 2025/2026 AI-search benchmarks — planning estimates, not
                  promises. The full logic behind them is explained above. We&apos;ll
                  verify the real numbers live on a call.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <CtaBand
        title="Numbers don't lie. But the real picture is richer."
        body="Book a free call — we'll show you exactly what AI says about your company and competitors today."
        primaryLabel="Request a free 30-minute call"
      />
    </Layout>
  );
}
