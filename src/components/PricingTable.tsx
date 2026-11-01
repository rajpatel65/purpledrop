import { Check, ShieldCheck } from 'lucide-react';
import { SERVICES } from '../lib/content';
import { PRICING } from '../lib/pricing';
import { useCurrency } from '../hooks/useCurrency';
import { FadeIn } from './FadeIn';

export function PricingTable() {
  const { price } = useCurrency();

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-soft">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">purpleDrop services and published prices</caption>
        <thead>
          <tr className="border-b border-line bg-cream/60">
            <th scope="col" className="px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Service
            </th>
            <th scope="col" className="hidden px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft sm:table-cell">
              Timeline
            </th>
            <th scope="col" className="px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Price
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {SERVICES.map((service) => (
            <tr key={service.id} className="transition-colors hover:bg-cream/40">
              <td className="px-6 py-6">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet" />
                  <div>
                    <p className="font-semibold text-ink">{service.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{service.tagline}</p>
                  </div>
                </div>
              </td>
              <td className="hidden px-6 py-6 text-sm text-ink-soft sm:table-cell">{service.timeline}</td>
              <td className="px-6 py-6">
                <p className="font-serif text-2xl font-medium tracking-tight text-ink">
                  {price(PRICING[service.priceKey])}
                  {service.priceKey === 'trackingMonthly' && (
                    <span className="font-sans text-sm text-ink-faint"> /mo</span>
                  )}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-line bg-violet-tint/50 px-6 py-5">
        <p className="flex items-start gap-3 text-sm text-ink">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet" />
          <span>
            The price on the page is the price you pay. No hourly billing, no surprise invoices.
            The audit report is yours to keep either way.
          </span>
        </p>
      </div>
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="grid gap-x-10 gap-y-0 md:grid-cols-2">
      {items.map((item, i) => (
        <FadeIn key={item.q} delay={i * 0.05}>
          <details className="group border-b border-line py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-medium text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-line text-violet transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        </FadeIn>
      ))}
    </div>
  );
}
