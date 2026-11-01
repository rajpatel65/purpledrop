import { Link } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';
import { EmailVerification } from '../components/soc2/EmailVerification';
import { QuestionCard } from '../components/soc2/QuestionCard';
import { SectionNav } from '../components/soc2/SectionNav';
import { ResultsPage } from '../components/soc2/ResultsPage';
import { useSoc2Assessment } from '../hooks/useSoc2Assessment';
import { SOC2_SECTIONS } from '../lib/soc2-questions';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useMemo } from 'react';

export function Soc2AssessmentPage() {
  const {
    state,
    currentQuestions,
    sectionProgressMap,
    overallStats,
    canProceed,
    sendVerificationCode,
    verifyCode,
    answerQuestion,
    saveProgress,
    goToSection,
    nextSection,
    prevSection,
    clearPersisted,
  } = useSoc2Assessment();

  const sectionProgressMapMemo = useMemo(() => sectionProgressMap, [sectionProgressMap]);

  if (!state.verified) {
    return (
      <Layout>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'SOC2 Readiness Assessment' }]} />
        <EmailVerification
          onVerified={() => {}}
          sendCode={sendVerificationCode}
          verifyCode={verifyCode}
          error={state.error}
          status={state.status as 'idle' | 'verifying' | 'error'}
        />
      </Layout>
    );
  }

  if (state.status === 'complete') {
    return (
      <Layout>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'SOC2 Readiness Assessment' }]} />
        <ResultsPage
          sessionId={state.sessionId || ''}
          answers={state.answers}
          email={state.email}
        />
      </Layout>
    );
  }

  const handleAnswer = (questionId: string, answer: 'yes' | 'no' | 'dont_know') => {
    answerQuestion(questionId, answer);
    const newCount = Object.keys(state.answers).length + (state.answers[questionId] ? 0 : 1);
    if (newCount % 5 === 0) {
      saveProgress('in_progress');
    }
  };

  const handleQuestionAnswer = (questionId: string) => (answer: 'yes' | 'no' | 'dont_know') => {
    handleAnswer(questionId, answer);
  };

  const handleNext = () => {
    if (canProceed) {
      if (state.currentSectionIndex === SOC2_SECTIONS.length - 1) {
        saveProgress('completed');
      } else {
        nextSection();
      }
    }
  };

  const handlePrev = () => {
    prevSection();
  };

  const handleSectionChange = (index: number) => {
    goToSection(index);
  };

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'SOC2 Readiness Assessment' }]} />
      <div className="min-h-screen bg-paper flex flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
          <div className="container-page flex h-18 items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2" onClick={e => { e.preventDefault(); clearPersisted(); }}>
                <Shield className="w-8 h-8 text-violet" />
                <span className="font-semibold text-ink">purpleDrop</span>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-ink-faint">
                <span>SOC2 Security Readiness</span>
                <span className="px-2 py-0.5 bg-violet-tint text-violet rounded text-xs font-medium">CC1–CC9</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-ink-soft">
                <span>{overallStats.completionPct}% complete</span>
                <div className="w-32 h-2 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet transition-all duration-300"
                    style={{ width: `${overallStats.completionPct}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => { if (confirm('Discard progress?')) clearPersisted(); }}
                className="p-2 text-ink-faint hover:text-ink hover:bg-cream rounded-lg transition-colors"
                aria-label="Exit assessment"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2">
            <FadeIn className="space-y-6">
              {currentQuestions.map((question: any, index: number) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  answer={state.answers[question.id] || null}
                  onAnswer={handleQuestionAnswer(question.id)}
                  index={index}
                  showHelp={false}
                  onToggleHelp={() => {}}
                />
              ))}

              {currentQuestions.length === 0 && (
                <FadeIn className="text-center py-12 text-ink-faint">
                  No questions in this section.
                </FadeIn>
              )}
            </FadeIn>
          </div>

          <SectionNav
            currentIndex={state.currentSectionIndex}
            onSectionChange={handleSectionChange}
            onNext={handleNext}
            onPrev={handlePrev}
            canProceed={canProceed}
            sectionProgress={sectionProgressMapMemo}
            disabled={state.status === 'saving'}
          />
        </main>
      </div>
    </Layout>
  );
}