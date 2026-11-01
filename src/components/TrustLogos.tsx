import { FadeIn } from './FadeIn';

export interface TrustLogosProps {
  logos: Array<{ name: string; href?: string }>;
}

export function TrustLogos({ logos }: TrustLogosProps) {
  return (
    <FadeIn>
      <div className="py-12 border-y border-line">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint text-center mb-8">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {logos.map((logo, i) => (
            <FadeIn key={logo.name} delay={i * 0.05}>
              <a
                href={logo.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-[11px] font-medium text-ink-faint hover:text-violet transition-colors"
              >
                {logo.name}
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}