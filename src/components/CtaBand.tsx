import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from './FadeIn';

interface CtaBandProps {
  title: string;
  body?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  calendarEmbed?: boolean;
  calendarUrl?: string;
}

export function CtaBand({
  title,
  body,
  primaryLabel = 'Request a free 30-minute call',
  primaryTo = '/contact',
  secondaryLabel,
  secondaryTo = '/services',
  calendarEmbed = false,
  calendarUrl = 'https://cal.com/akshaypatel',
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-violet">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(26,24,21,0.35),transparent_50%)]" />
      <div className="container-page relative py-24 text-center">
        <FadeIn>
          <h2 className="mx-auto max-w-3xl font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            {title}
          </h2>
          {body && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-violet-100/90">{body}</p>
          )}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {calendarEmbed ? (
              <iframe
                src={calendarUrl}
                className="w-full sm:w-[320px] h-[380px] sm:h-[420px] rounded-xl border-0 bg-white shadow-lg"
                title="Book a free 30-minute call"
                style={{ border: 'none' }}
              />
            ) : (
              <Link to={primaryTo} className="btn bg-white text-violet hover:bg-violet-tint">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {secondaryLabel && !calendarEmbed && (
              <Link
                to={secondaryTo}
                className="btn border border-white/40 text-white hover:bg-white/10"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
          <p className="mt-8 text-xs font-mono uppercase tracking-[0.18em] text-violet-200/80">
            Fixed published prices · You keep the audit report · No jargon, ever
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
