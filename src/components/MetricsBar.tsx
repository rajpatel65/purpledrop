import { FadeIn } from './FadeIn';

export interface MetricItem {
  value: string;
  label: string;
}

export interface MetricsBarProps {
  metrics: MetricItem[];
}

export function MetricsBar({ metrics }: MetricsBarProps) {
  return (
    <FadeIn>
      <div className="py-16 bg-cream/50 border-y border-line">
        <div className="container-page">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {metrics.map((metric, i) => (
              <FadeIn key={metric.value} delay={i * 0.05}>
                <div className="p-4">
                  <div className="font-serif text-4xl font-medium text-violet mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-ink-soft leading-relaxed max-w-xs mx-auto">
                    {metric.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}