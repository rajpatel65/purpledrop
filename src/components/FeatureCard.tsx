import { LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  index?: number;
  accent?: 'violet' | 'gold';
}

export function FeatureCard({ icon: Icon, title, body, accent = 'violet' }: FeatureCardProps) {
  const accentClasses = {
    violet: 'bg-violet/5 text-violet border-violet/10 group-hover:bg-violet/10 group-hover:border-violet/20',
    gold: 'bg-gold/10 text-gold border-gold/20 group-hover:bg-gold/20 group-hover:border-gold/30',
  };

  return (
    <div className="group relative p-6 bg-paper border border-line rounded-2xl hover:border-violet/20 transition-all duration-300 h-full">
      <div className={`p-3 rounded-xl ${accentClasses[accent]} transition-colors mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg text-ink mb-2 group-hover:text-violet transition-colors">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}