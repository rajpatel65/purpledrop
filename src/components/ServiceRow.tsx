import { Check, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from './FadeIn';
import type { Service } from '../lib/content';

export function ServiceRow({ service, index }: { service: Service; index: number }) {


  return (
    <FadeIn delay={index * 0.08}>
      <article
        className="group relative grid gap-6 border-t border-line py-12 transition-all duration-500 [transform:perspective(1000px)] hover:[transform:perspective(1000px)_rotateX(1.2deg)] md:grid-cols-[120px_1fr_300px] md:gap-10"
      >
        <div className="flex items-start gap-5 md:block">
          <span className="font-serif text-3xl font-medium text-violet">{service.step}</span>
          <p className="mt-0 text-sm font-medium text-ink md:mt-3">{service.tagline}</p>
        </div>

        <div>
          <h3 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            {service.title}
          </h3>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">{service.problem}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink">{service.outcome}</p>

          <ul className="mt-6 space-y-2.5">
            {service.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-start gap-2 text-sm text-ink">
            <span className="font-semibold">Scope:</span>
            <span className="text-ink-soft">{service.guarantee}</span>
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end md:border-l md:border-line md:pl-8">
          <Link to="/pricing" className="text-sm font-semibold text-violet">See price and details</Link>
          <p className="flex items-center gap-1.5 text-xs text-ink-faint">
            <Clock className="h-3.5 w-3.5" />
            {service.timeline}
            {service.priceNote ? ` · ${service.priceNote}` : ''}
          </p>
          <Link
            to="/contact"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-violet transition-colors hover:text-violet-deep"
          >
            Discuss this
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </article>
    </FadeIn>
  );
}
