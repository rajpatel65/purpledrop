import { Quote } from 'lucide-react';
import type { TestimonialSlot } from '../lib/content';
import { FadeIn } from './FadeIn';

export function TestimonialCard({ item, index }: { item: TestimonialSlot; index: number }) {
  return (
    <FadeIn delay={index * 0.08}>
      <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-paper p-8 shadow-soft">
        <div>
          <Quote className="h-7 w-7 text-violet" aria-hidden="true" />
          <blockquote className="mt-5 font-serif text-xl leading-relaxed text-ink">
            “{item.quote}”
          </blockquote>
        </div>
        <figcaption className="mt-8">
          <p className="font-semibold text-ink">{item.name}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
            {item.role}
          </p>
        </figcaption>
      </figure>
    </FadeIn>
  );
}
