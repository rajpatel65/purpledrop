import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface FreeToolCardProps {
  tool: {
    to: string;
    label: string;
    description: string;
    icon: LucideIcon;
    highlight: string;
  };
}

export function FreeToolCard({ tool }: FreeToolCardProps) {
  const Icon = tool.icon;
  return (
    <Link
      to={tool.to}
      className="group relative flex flex-col h-full p-6 bg-paper border border-line rounded-2xl shadow-card hover:shadow-card-hover hover:border-violet/30 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="p-3 rounded-xl bg-violet/5 text-violet border border-violet/10 group-hover:bg-violet/10 group-hover:border-violet/20 group-hover:text-white transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        {tool.highlight && (
          <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-[0.1em] bg-violet/10 text-violet rounded-full">
            {tool.highlight}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-lg text-ink mb-2 group-hover:text-violet transition-colors">{tool.label}</h3>
      <p className="text-sm text-ink-soft leading-relaxed flex-1 mb-4">{tool.description}</p>
      <div className="flex items-center gap-2 text-sm font-medium text-violet group-hover:gap-3 transition-all">
        Start now
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </Link>
  );
}