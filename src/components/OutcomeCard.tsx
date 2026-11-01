import { FadeIn } from './FadeIn';

export interface OutcomeCardProps {
  metric: string;
  label: string;
  index?: number;
}

export function OutcomeCard({ metric, label, index = 0 }: OutcomeCardProps) {
  return (
    <FadeIn delay={index * 0.08}>
      <div className="p-6 bg-paper border border-line rounded-2xl text-center hover:border-violet/30 hover:shadow-card-hover transition-all duration-300">
        <div className="font-serif text-4xl font-medium text-violet mb-2">{metric}</div>
        <div className="text-sm text-ink-soft leading-relaxed">{label}</div>
      </div>
    </FadeIn>
  );
}