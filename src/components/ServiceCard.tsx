import { Link } from 'react-router-dom';
import { Shield, Zap, Boxes, BarChart2, ArrowRight, Check, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FadeIn } from './FadeIn';

export interface ServiceCardProps {
  step: string;
  title: string;
  tag: string;
  badge?: 'popular' | 'value' | null;
  icon: 'shield' | 'zap' | 'boxes' | 'chart';
  price: number;
  timeline: string;
  problem: string;
  outcome: string;
  proof: string;
  bullets: string[];
  guarantee: string;
  ctaLabel: string;
  ctaHref: string;
  index: number;
}

const ICONS = {
  shield: Shield,
  zap: Zap,
  boxes: Boxes,
  chart: BarChart2,
};

export function ServiceCard({
  step,
  title,
  tag,
  badge,
  icon,
  price,
  timeline,
  problem,
  outcome,
  proof,
  bullets,
  guarantee,
  ctaLabel,
  ctaHref,
  index,
}: ServiceCardProps) {
  const Icon = ICONS[icon];

  return (
    <FadeIn delay={index * 0.08}>
      <article className="group relative flex flex-col h-full p-8 bg-paper border border-line rounded-2xl shadow-card hover:shadow-card-hover hover:border-violet/30 hover:-translate-y-1 transition-all duration-300">
        {badge && (
          <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-mono font-medium uppercase tracking-[0.1em] rounded-full ${
            badge === 'popular' ? 'bg-violet text-paper' : 'bg-gold text-ink'
          }`}>
            {badge === 'popular' ? 'Most Popular' : 'Best Value'}
          </span>
        )}

        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 p-3 rounded-xl bg-violet/5 text-violet border border-violet/10 group-hover:bg-violet/10 group-hover:border-violet/20 transition-colors">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-serif text-2xl font-medium text-violet">{step}</span>
            <p className="mt-1 text-sm font-medium text-ink-soft">{tag}</p>
          </div>
        </div>

        <h3 className="font-serif text-2xl font-medium tracking-tight text-ink mb-4">{title}</h3>

        {/* Problem → Outcome → Proof */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <AlertTriangle className="flex-shrink-0 h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-700 text-sm mb-1">The Problem</p>
              <p className="text-sm text-red-600">{problem}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
            <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-700 text-sm mb-1">The Outcome</p>
              <p className="text-sm text-green-600">{outcome}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-100 rounded-xl">
            <Check className="flex-shrink-0 h-5 w-5 text-violet-600 mt-0.5" />
            <div>
              <p className="font-medium text-violet-700 text-sm mb-1">The Proof</p>
              <p className="text-sm text-violet-600">{proof}</p>
            </div>
          </div>
        </div>

        <ul className="space-y-2.5 mb-6">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-soft">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet/70" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <p className="mb-6 flex items-start gap-2 text-sm text-ink">
          <span className="font-semibold text-ink-soft">Guarantee:</span>
          <span className="text-ink-soft">{guarantee}</span>
        </p>

        <div className="mt-auto pt-6 border-t border-line">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div>
              <p className="font-serif text-3xl font-medium tracking-tight text-ink">${price.toLocaleString()}</p>
              <p className="flex items-center gap-1.5 text-xs text-ink-faint mt-1">
                <span className="w-3.5 h-3.5 rounded-full bg-violet/10 flex items-center justify-center">
                  <svg className="h-3.5 w-3.5 text-violet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </span>
                {timeline}
              </p>
            </div>
          </div>
          <Link
            to={ctaHref}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-violet transition-colors hover:text-violet-deep py-2"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    </FadeIn>
  );
}