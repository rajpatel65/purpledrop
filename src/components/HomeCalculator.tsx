import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function estimateLeadValue(leads: number, closeRate: number, jobValue: number, extraLeads: number) {
  if (![leads, closeRate, jobValue, extraLeads].every(Number.isFinite) ||
      Math.min(leads, closeRate, jobValue, extraLeads) < 0 || closeRate > 100) return null;
  const baselineRevenue = leads * closeRate / 100 * jobValue;
  const additionalCustomers = extraLeads * closeRate / 100;
  const additionalRevenue = additionalCustomers * jobValue;
  return { baselineRevenue, additionalCustomers, additionalRevenue, scenarioRevenue: baselineRevenue + additionalRevenue };
}
const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const count = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

export function LeadValueCalculator({ full = false }: { full?: boolean }) {
  const [values, setValues] = useState(['', '', '', '']);
  const [showResults, setShowResults] = useState(false);
  const parsed = values.map(v => v.trim() === '' ? NaN : Number(v));
  const result = estimateLeadValue(parsed[0], parsed[1], parsed[2], parsed[3]);
  const fields = [
    { label: 'Current monthly leads', help: 'Use enquiries, not website visits.', max: 1000000000, step: '1' },
    { label: 'Lead-to-customer close rate (%)', help: 'What share of leads become paying customers?', max: 100, step: 'any' },
    { label: 'Average job or sale value (USD)', help: 'Use one sale value, not lifetime value.', max: 1000000000000, step: 'any' },
    { label: 'Extra monthly leads to model', help: 'Your what-if input, not a predicted AI uplift.', max: 1000000000, step: '1' },
  ];
  const prefix = full ? 'calc' : 'home-calc';
  return (
    <div className="card p-6 sm:p-8 md:p-10">
      <p className="text-sm leading-relaxed text-ink-soft">Enter your own numbers to see what extra leads could be worth. Nothing here measures your AI visibility, predicts lost traffic or promises more enquiries. No email required.</p>
      <form className="mt-7" onSubmit={e => { e.preventDefault(); if (result) setShowResults(true); }}>
        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map((field, i) => (
            <div key={field.label}>
              <label htmlFor={`${prefix}-${i}`} className="mb-2 block text-sm font-medium text-ink">{field.label}</label>
              <input id={`${prefix}-${i}`} type="number" required min="0" max={field.max} step={field.step}
                value={values[i]} onChange={e => { setValues(values.map((v, j) => j === i ? e.target.value : v)); setShowResults(false); }}
                aria-describedby={`${prefix}-help-${i}`}
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-base text-ink focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet" />
              <p id={`${prefix}-help-${i}`} className="mt-2 text-xs leading-relaxed text-ink-soft">{field.help}</p>
            </div>
          ))}
        </div>
        <button type="submit" className="btn-primary mt-7 w-full sm:w-auto">Calculate estimate <ArrowRight className="h-4 w-4" /></button>
      </form>
      <p className="mt-4 text-xs leading-relaxed text-ink-faint">All four inputs are required. Zero is valid. All results use one month and USD. Your inputs are calculated in this page and are not submitted as a lead.</p>
      {showResults && result && <div className="mt-8 border-t border-line pt-7" aria-live="polite">
        <p className="eyebrow">Your monthly what-if estimate</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            ['Current estimated monthly revenue', money(result.baselineRevenue)],
            ['Extra expected customers per month', count(result.additionalCustomers)],
            ['Additional estimated monthly revenue', money(result.additionalRevenue)],
            ['Total monthly revenue in this scenario', money(result.scenarioRevenue)],
          ].map(([label, value]) => <div key={label} className="min-w-0 rounded-xl border border-line bg-paper p-5">
            <p className="text-xs leading-relaxed text-ink-soft">{label}</p>
            <p className="mt-2 break-words font-serif text-3xl font-medium text-ink">{value}</p>
          </div>)}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-ink-soft">Formula: extra monthly leads × close rate ÷ 100 × average job value = additional estimated monthly revenue. Example only: 10 extra leads × 20% × $500 = $1,000 per month.</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">This is revenue, not profit or ROI. Delivery costs, margins, marketing spend, refunds and repeat business are excluded. Fractional customers represent an average over time. The scenario assumes your entered close rate and sale value apply to the extra leads; that may not happen in practice.</p>
        {full && <p className="mt-3 text-sm leading-relaxed text-ink-soft">To check whether AI is actually a source of leads, record how customers found you and compare it with your analytics and sales records. This calculator does not collect or verify those records.</p>}
      </div>}
    </div>
  );
}

export function HomeCalculator() {
  return <section className="border-b border-line bg-paper py-24">
    <div className="container-page max-w-4xl">
      <p className="eyebrow text-center">See your numbers</p>
      <h2 className="mt-4 text-center font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">What could a few more leads be worth?</h2>
      <p className="mt-4 text-center text-lg text-ink-soft">A planning estimate using your numbers, not a forecast.</p>
      <div className="mt-10"><LeadValueCalculator /></div>
      <p className="mt-6 text-center"><Link to="/calculator" className="text-sm text-violet underline">How the estimate works</Link></p>
    </div>
  </section>;
}
