import type { ProcessAct } from '../lib/content';
import { FadeIn } from './FadeIn';

export function ProcessRail({ acts }: { acts: ProcessAct[] }) {
  return (
    <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
      {acts.map((act, i) => (
        <FadeIn key={act.act} delay={i * 0.08}>
          <li className="relative border-t-2 border-ink pt-6">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-violet">
              {act.act}
            </span>
            <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight text-ink">{act.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{act.body}</p>
          </li>
        </FadeIn>
      ))}
    </ol>
  );
}
