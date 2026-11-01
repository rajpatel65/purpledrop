import type { Outcome } from '../lib/content';
import { FadeIn } from './FadeIn';

export function Metrics({ items, dark = false }: { items: Outcome[]; dark?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
      {items.map((item, i) => (
        <FadeIn key={item.metric} delay={i * 0.06} className="h-full">
          <div className={`h-full p-7 ${dark ? 'bg-violet-deep text-white' : 'bg-paper'}`}>
            <p className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">{item.metric}</p>
            <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-violet-100' : 'text-ink-soft'}`}>
              {item.label}
            </p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
