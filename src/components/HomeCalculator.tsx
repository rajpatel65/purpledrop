import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import { FadeIn } from './FadeIn';

const fmt = (n: number) =>
  n >= 1000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : n >= 1000
      ? `$${(n / 1000).toFixed(0)}K`
      : `$${Math.round(n).toLocaleString()}`;

export function HomeCalculator() {
  const [traffic, setTraffic] = useState('10000');
  const [conversion, setConversion] = useState('2.0');
  const [ltv, setLtv] = useState('500');
  const [showResults, setShowResults] = useState(false);

  const calc = useMemo(() => {
    const t = parseFloat(traffic) || 0;
    const cr = (parseFloat(conversion) || 2) / 100;
    const value = parseFloat(ltv) || 0;

    const traditionalLossRate = 0.35;
    const geoConversionMultiplier = 2.1;
    const geoRecaptureRate = 0.30;

    const currentMonthlyRevenue = t * cr * value * 12;
    const revenueLostAnnual = t * traditionalLossRate * cr * value * 12;
    const geoRevenuePotentialAnnual = t * traditionalLossRate * geoRecaptureRate * cr * geoConversionMultiplier * value * 12;
    const netAnnualLoss = revenueLostAnnual - geoRevenuePotentialAnnual;

    return { currentMonthlyRevenue, revenueLostAnnual, geoRevenuePotentialAnnual, netAnnualLoss };
  }, [traffic, conversion, ltv]);

  return (
    <section className="border-b border-line bg-paper py-24">
      <div className="container-page max-w-4xl">
        <FadeIn>
          <p className="eyebrow text-center">See your numbers</p>
          <h2 className="mt-4 text-center font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            What is this shift costing you?
          </h2>
          <p className="mt-4 text-center text-lg text-ink-soft">
            35% of organic clicks now go to AI overviews. Enter your numbers — see what&apos;s at stake.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-12 card p-8 md:p-10">
            {!showResults ? (
              <div className="grid gap-5 sm:grid-cols-4">
                <div>
                  <label htmlFor="hc-traffic" className="mb-1.5 block text-xs font-medium text-ink-soft">
                    Monthly organic traffic
                  </label>
                  <input
                    id="hc-traffic"
                    type="number"
                    min="0"
                    value={traffic}
                    onChange={(e) => setTraffic(e.target.value)}
                    className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                  />
                </div>
                <div>
                  <label htmlFor="hc-cr" className="mb-1.5 block text-xs font-medium text-ink-soft">
                    Conversion rate (%)
                  </label>
                  <input
                    id="hc-cr"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={conversion}
                    onChange={(e) => setConversion(e.target.value)}
                    className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                  />
                </div>
                <div>
                  <label htmlFor="hc-ltv" className="mb-1.5 block text-xs font-medium text-ink-soft">
                    Avg customer value ($)
                  </label>
                  <input
                    id="hc-ltv"
                    type="number"
                    min="0"
                    value={ltv}
                    onChange={(e) => setLtv(e.target.value)}
                    className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setShowResults(true)}
                    className="btn-primary w-full"
                  >
                    See impact
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Results */}
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 text-center">
                    <TrendingDown className="mx-auto h-5 w-5 text-red-500" />
                    <p className="mt-2 font-serif text-3xl font-medium text-red-600">{fmt(calc.revenueLostAnnual)}</p>
                    <p className="mt-1 text-xs text-red-600/80">Annual revenue at risk</p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50/50 p-5 text-center">
                    <TrendingUp className="mx-auto h-5 w-5 text-green-600" />
                    <p className="mt-2 font-serif text-3xl font-medium text-green-700">{fmt(calc.geoRevenuePotentialAnnual)}</p>
                    <p className="mt-1 text-xs text-green-700/80">GEO recapture potential</p>
                  </div>
                  <div className="rounded-xl border border-violet/20 bg-violet-tint p-5 text-center">
                    <DollarSign className="mx-auto h-5 w-5 text-violet" />
                    <p className="mt-2 font-serif text-3xl font-medium text-violet">{fmt(calc.netAnnualLoss)}</p>
                    <p className="mt-1 text-xs text-ink-soft">Net annual impact</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link to="/calculator" className="btn-primary">
                    Get the full breakdown
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-sm text-ink-faint hover:text-ink"
                  >
                    ← recalculate
                  </button>
                </div>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
