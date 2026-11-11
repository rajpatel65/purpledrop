import { useEffect, useRef } from 'react';
import { HelpCircle, Shield, AlertTriangle, Info } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { SOC2Question } from '../../lib/soc2-questions';

interface QuestionCardProps {
  question: SOC2Question;
  answer: 'yes' | 'no' | 'dont_know' | null;
  onAnswer: (answer: 'yes' | 'no' | 'dont_know') => void;
  index: number;
  showHelp: boolean;
  onToggleHelp: () => void;
}

const OPTIONS = [
  { value: 'yes' as const, label: 'Yes', icon: Shield, color: 'bg-violet-tint text-violet-deep border-violet/30 hover:bg-violet/10', description: 'I report this is implemented; evidence not reviewed' },
  { value: 'no' as const, label: 'No', icon: AlertTriangle, color: 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100', description: 'Not implemented or not documented' },
  { value: 'dont_know' as const, label: 'Don\'t Know', icon: Info, color: 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100', description: 'Unsure or partially implemented' },
];

export function QuestionCard({ question, answer, onAnswer, index, showHelp, onToggleHelp }: QuestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [index]);

  const difficultyColors = {
    easy: 'bg-cream text-ink-faint',
    medium: 'bg-yellow-50 text-yellow-700',
    hard: 'bg-orange-50 text-orange-700',
  };

  return (
    <FadeIn delay={Math.min(index * 0.05, 0.2)} className="relative">
      <div
        ref={cardRef}
        className={`bg-paper rounded-xl border-2 transition-all duration-300 ${
          answer ? 'border-violet/40 shadow-sm' : 'border-line hover:border-violet/20'
        }`}
        data-question-id={question.id}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty]}`}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </span>
                <span className="text-sm text-ink-faint font-mono">{question.criterion}</span>
              </div>
              <h3 className="text-lg font-medium text-ink leading-relaxed">{question.question}</h3>
            </div>
            <button
              onClick={onToggleHelp}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${showHelp ? 'bg-violet-tint text-violet' : 'text-ink-faint hover:text-ink hover:bg-cream'}`}
              aria-label={showHelp ? 'Hide help' : 'Show help'}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {showHelp && (
            <div className="mb-4 p-4 bg-cream/50 rounded-lg border border-line animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-ink-faint flex-shrink-0 mt-0.5" />
                <div className="text-sm text-ink-soft space-y-2">
                  <p>{question.helpText}</p>
                  {question.evidenceHint && (
                    <p className="font-medium text-ink">
                      <strong>Evidence to look for:</strong> {question.evidenceHint}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label={question.question}>
            {OPTIONS.map(option => {
              const isSelected = answer === option.value;
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onAnswer(option.value)}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all duration-200 group ${
                    isSelected
                      ? 'border-violet bg-violet-tint shadow-sm'
                      : option.color + ' hover:shadow-md'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${option.label}: ${option.description}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-violet/20' : 'bg-cream/50'}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-violet' : option.color.replace('bg-', 'text-').replace('50', '600')}`} />
                    </div>
                    <span className="font-medium text-ink">{option.label}</span>
                  </div>
                  <p className="mt-2 text-xs text-ink-faint">{option.description}</p>
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-violet rounded-lg pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {answer && (
            <div className="mt-4 p-3 bg-violet-tint border border-violet/30 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <Shield className="w-5 h-5 text-violet" />
              <div className="text-sm text-violet-deep">
                <span className="font-medium">
                  {answer === 'yes' ? 'Reported Yes' : answer === 'no' ? 'Gap identified' : 'Uncertain'}
                </span>
                {' — '}
                {answer === 'no' && 'This will appear in your gap report as a lead item.'}
                {answer === 'dont_know' && 'We\'ll help you investigate this during a follow-up.'}
                {answer === 'yes' && 'Self-reported only. Keep evidence for an independent review.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
