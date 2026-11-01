import { FadeIn } from './FadeIn';

const COMPETITORS = [
  {
    name: 'Hartley & Shaw LLP',
    why: 'Clear service pages, named M&A deals, fees published',
  },
  {
    name: 'Crawford & Byrne',
    why: 'Recent manufacturing sector wins, client quotes on site',
  },
  {
    name: 'The Aldrich Partnership',
    why: 'Consistent listings across three directories',
  },
];

export function AiAnswerCard() {
  return (
    <FadeIn>
      <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/55 shadow-lift backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/60 bg-white/50 px-6 py-4">
          <span className="h-3 w-3 rounded-full bg-red-300" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
          <p className="ml-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
            Your buyer&apos;s AI assistant
          </p>
        </div>

        <div className="space-y-5 p-6 md:p-8">
          <div className="ml-auto max-w-sm rounded-2xl rounded-tr-sm bg-violet-tint/70 px-5 py-4 text-sm leading-relaxed text-ink">
            We need a commercial lawyer in Charlotte who handles M&amp;A for manufacturers. Who
            should we talk to?
          </div>

          <div className="max-w-md rounded-2xl rounded-tl-sm border border-white/70 bg-white/70 px-5 py-4 text-sm leading-relaxed text-ink-soft">
            <p>Here are three firms worth contacting:</p>
            <ol className="mt-3 space-y-3">
              {COMPETITORS.map((c, i) => (
                <li key={c.name} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-tint font-mono text-[11px] font-semibold text-violet-deep">
                    {i + 1}
                  </span>
                  <span>
                    <span className="font-semibold text-ink">{c.name}</span>
                    <span className="block text-xs text-ink-faint">{c.why}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-ink-faint">
              Based on your description, these firms match best.
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-violet bg-violet-tint/30 px-5 py-4">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-deep">
              Your company isn&apos;t in the answer
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              And you never knew the question was asked. That&apos;s the quiet cost of the AI
              shortlist.
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
