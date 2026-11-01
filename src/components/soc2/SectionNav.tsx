import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, HelpCircle, MinusCircle } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { SOC2_SECTIONS } from '../../lib/soc2-questions';

interface SectionNavProps {
  currentIndex: number;
  onSectionChange: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  sectionProgress: Record<string, { answered: number; total: number; gaps: number }>;
  disabled?: boolean;
}

export function SectionNav({
  currentIndex,
  onSectionChange,
  onNext,
  onPrev,
  canProceed,
  sectionProgress,
  disabled,
}: SectionNavProps) {
  const getSectionStatus = (sectionId: string) => {
    const progress = sectionProgress[sectionId];
    if (!progress || progress.answered === 0) return 'pending';
    if (progress.gaps > 0) return 'gaps';
    if (progress.answered === progress.total) return 'complete';
    return 'in-progress';
  };

  const renderSectionButton = (section: typeof SOC2_SECTIONS[number], index: number) => {
    const status = getSectionStatus(section.id);
    const isCurrent = index === currentIndex;

    const baseClasses = 'relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 min-w-0';
    let colorClasses = '';
    let icon = null;

    switch (status) {
      case 'complete':
        colorClasses = 'bg-green-100 text-green-700 hover:bg-green-200';
        icon = <CheckCircle className="w-4 h-4" />;
        break;
      case 'gaps':
        colorClasses = 'bg-red-100 text-red-700 hover:bg-red-200';
        icon = <AlertCircle className="w-4 h-4" />;
        break;
      case 'in-progress':
        colorClasses = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
        icon = <HelpCircle className="w-4 h-4" />;
        break;
      default:
        colorClasses = 'bg-cream text-ink-faint hover:bg-cream/50';
        icon = <MinusCircle className="w-4 h-4" />;
    }

    if (isCurrent) {
      colorClasses = 'bg-violet text-paper shadow-sm';
    }

    return (
      <button
        key={section.id}
        onClick={() => !disabled && onSectionChange(index)}
        disabled={disabled}
        className={`${baseClasses} ${colorClasses} ${isCurrent ? 'ring-2 ring-violet ring-offset-2 ring-offset-paper' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
        title={`${section.title} — ${status === 'pending' ? 'Not started' : status === 'complete' ? 'Complete' : status === 'gaps' ? 'Has gaps' : 'In progress'}`}
      >
        {icon}
        <span className="hidden sm:inline truncate">{section.title}</span>
        <span className="hidden sm:inline text-xs opacity-70">{section.criterion}</span>
      </button>
    );
  };

  return (
    <FadeIn className="sticky bottom-0 z-10">
      <div className="bg-paper/95 backdrop-blur-sm border-t border-line">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1 overflow-x-auto scrollbar-hide pb-2">
              <div className="flex gap-2 min-w-max">
                {SOC2_SECTIONS.map(renderSectionButton)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2 border-t border-line">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0 || disabled}
              className="px-4 py-2 text-sm font-medium text-ink-soft bg-paper border border-line rounded-lg hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex-1 text-center">
              <div className="text-xs text-ink-faint mb-1">
                Section {currentIndex + 1} of {SOC2_SECTIONS.length}
              </div>
              <div className="h-2 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / SOC2_SECTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {currentIndex === SOC2_SECTIONS.length - 1 ? (
              <button
                onClick={() => onNext()}
                disabled={!canProceed || disabled}
                className="px-6 py-2 text-sm font-medium text-paper bg-violet rounded-lg hover:bg-violet-deep disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-end transition-colors ml-auto"
              >
                <span className="hidden sm:inline">Complete Assessment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onNext}
                disabled={!canProceed || disabled}
                className="px-6 py-2 text-sm font-medium text-paper bg-violet rounded-lg hover:bg-violet-deep disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-end transition-colors ml-auto"
              >
                <span className="hidden sm:inline">Next Section</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}