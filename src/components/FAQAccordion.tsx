import { ChevronDown } from 'lucide-react';
import { FadeIn } from './FadeIn';

export interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  index?: number;
}

export function FAQItem({ question, answer, index = 0 }: FAQItemProps) {
  return (
    <FadeIn delay={index * 0.05}>
      <details className="group bg-paper border border-line rounded-xl overflow-hidden">
        <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
          <h3 className="font-semibold text-lg text-ink pr-10">{question}</h3>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cream flex items-center justify-center transition-transform duration-200 group-open:rotate-180">
            <ChevronDown className="h-4 w-4 text-ink transition-transform duration-200 group-open:rotate-180" />
          </div>
        </summary>
        <div className="px-5 pb-5 text-ink-soft leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200">
          {answer}
        </div>
      </details>
    </FadeIn>
  );
}

export interface FAQAccordionProps {
  items: Array<{ question: string; answer: React.ReactNode }>;
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="space-y-3 max-w-3xl">
      {items.map((item, i) => (
        <FAQItem key={i} {...item} index={i} />
      ))}
    </div>
  );
}