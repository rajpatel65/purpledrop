import { Shield, BadgeCheck, Users, Compass } from 'lucide-react';
import { FadeIn } from './FadeIn';

export interface TrustBadgeProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const BADGES = [
  {
    icon: Shield,
    title: 'Confidential by Default',
    description: 'NDAs on request; every engagement stays between us',
  },
  {
    icon: BadgeCheck,
    title: 'Fixed Price, In Writing',
    description: 'The number on the page is the number you pay',
  },
  {
    icon: Users,
    title: 'Senior-Only Team',
    description: 'The strategist you meet does the work',
  },
  {
    icon: Compass,
    title: 'Honest Even When It Costs Us',
    description: 'If AI already describes you well, we say so',
  },
];

export function TrustBadges() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {BADGES.map((badge, i) => (
        <FadeIn key={badge.title} delay={i * 0.05}>
          <div className="flex items-start gap-3 p-4 bg-paper border border-line rounded-xl hover:border-violet/20 transition-colors">
            <div className="flex-shrink-0 p-2.5 rounded-lg bg-violet/5 text-violet border border-violet/10">
              <badge.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-ink">{badge.title}</h4>
              <p className="text-xs text-ink-soft mt-0.5">{badge.description}</p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
