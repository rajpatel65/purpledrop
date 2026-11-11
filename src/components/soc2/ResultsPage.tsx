import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, HelpCircle, Download, Shield, FileText, BarChart2, Send } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { Layout } from '../Layout';
import { Breadcrumbs } from '../Breadcrumbs';
import { SOC2_SECTIONS, SOC2_QUESTIONS } from '../../lib/soc2-questions';
import { calculateStats, calculateSectionStats } from '../../lib/soc2-api';

interface ResultsPageProps {
  sessionId: string;
  answers: Record<string, 'yes' | 'no' | 'dont_know'>;
  email: string;
}

export function ResultsPage({ sessionId, answers, email }: ResultsPageProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [downloadFormat, setDownloadFormat] = useState<'json' | 'csv'>('json');

  const stats = calculateStats(answers);
  const sectionStats = SOC2_SECTIONS.reduce((acc, section) => {
    acc[section.id] = calculateSectionStats(answers, section.id);
    return acc;
  }, {} as Record<string, { answered: number; total: number; gaps: number }>);

  const gapsBySection = SOC2_SECTIONS.map(section => {
    const questions = SOC2_QUESTIONS.filter(q => q.section === section.id);
    const gapQuestions = questions.filter(q => answers[q.id] === 'no' || answers[q.id] === 'dont_know');
    return { section, gapQuestions };
  }).filter(({ gapQuestions }) => gapQuestions.length > 0);

  const totalGaps = gapsBySection.reduce((sum, { gapQuestions }) => sum + gapQuestions.length, 0);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId) ? prev.filter(s => s !== sectionId) : [...prev, sectionId]
    );
  };

  const downloadReport = () => {
    const report = {
      assessment: 'SOC2 Security Readiness (CC1-CC9)',
      assurance: 'Self-reported answers only. Completion is not compliance. No independent audit or attestation.',
      email,
      sessionId,
      date: new Date().toISOString(),
      summary: stats,
      sections: sectionStats,
      gaps: gapsBySection.flatMap(({ section, gapQuestions }) =>
        gapQuestions.map(q => ({
          section: section.title,
          criterion: q.criterion,
          question: q.question,
          answer: answers[q.id],
          difficulty: q.difficulty,
          evidenceHint: q.evidenceHint,
        }))
      ),
    };

    if (downloadFormat === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soc2-readiness-${sessionId.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Section', 'Criterion', 'Question', 'Answer', 'Difficulty', 'Evidence Hint'];
      const rows = report.gaps.map(g => [
        g.section,
        g.criterion,
        `"${g.question.replace(/"/g, '""')}"`,
        g.answer,
        g.difficulty,
        `"${g.evidenceHint?.replace(/"/g, '""') || ''}"`,
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soc2-readiness-${sessionId.slice(0, 8)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'SOC2 Readiness Report' }]} />
      <div className="min-h-screen bg-cream/30">
        <header className="bg-paper border-b border-line sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-tint flex items-center justify-center">
                  <Shield className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <h1 className="font-semibold text-ink">SOC2 Readiness Report</h1>
                  <p className="text-sm text-ink-soft">CC1–CC9 Security Criteria Assessment</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={downloadFormat}
                  onChange={e => setDownloadFormat(e.target.value as 'json' | 'csv')}
                  className="px-3 py-1.5 text-sm border border-line rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-violet"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </select>
                <button
                  onClick={downloadReport}
                  className="px-4 py-1.5 text-sm font-medium text-paper bg-violet rounded-lg hover:bg-violet-deep flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <FadeIn className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <FadeIn delay={0.1} className="bg-paper rounded-xl border border-line p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-ink">Self-Reported Assessment Summary</h2>
                    <p className="text-ink-soft mt-1">{stats.answered} of {stats.total} questions answered • {stats.completionPct}% complete</p>
                  </div>
                  <div className={`text-4xl font-bold text-ink px-4 py-2 rounded-xl bg-cream`}>
                    {stats.completionPct}%
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-ink-soft">Completion means questions answered, not controls passed. Answers have not been independently verified. This is not a SOC 2 audit, attestation or compliance determination.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-violet-tint rounded-lg border border-violet/30">
                    <div className="flex items-center gap-2 text-violet-deep mb-1">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Reported Yes</span>
                    </div>
                    <div className="text-3xl font-bold text-violet">{stats.yes}</div>
                    <div className="text-xs text-violet-deep">Self-reported, unverified</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-700 mb-1">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Gaps</span>
                    </div>
                    <div className="text-3xl font-bold text-red-600">{stats.no}</div>
                    <div className="text-xs text-red-600">Not implemented</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-700 mb-1">
                      <HelpCircle className="w-5 h-5" />
                      <span className="font-medium">Uncertain</span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">{stats.dontKnow}</div>
                    <div className="text-xs text-yellow-600">Need investigation</div>
                  </div>
                  <div className="p-4 bg-violet-tint rounded-lg border border-violet/30">
                    <div className="flex items-center gap-2 text-violet-deep mb-1">
                      <BarChart2 className="w-5 h-5" />
                      <span className="font-medium">Total Gaps</span>
                    </div>
                    <div className="text-3xl font-bold text-violet">{stats.gaps}</div>
                    <div className="text-xs text-violet">Action items</div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2} className="bg-paper rounded-xl border border-line overflow-hidden">
                <div className="p-4 border-b border-line">
                  <h3 className="font-semibold text-ink flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-violet" />
                    Section Breakdown
                  </h3>
                </div>
                <div className="divide-y divide-line">
                  {gapsBySection.map(({ section, gapQuestions }) => {
                    const progress = sectionStats[section.id];
                    const isExpanded = expandedSections.includes(section.id);
                    const pct = progress.total > 0 ? Math.round((progress.answered - progress.gaps) / progress.total * 100) : 0;

                    return (
                      <div key={section.id} className="p-4 hover:bg-cream/50 transition-colors">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between gap-4 text-left"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-tint text-violet">
                              <AlertCircle className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-ink truncate">{section.title}</h4>
                              <p className="text-sm text-ink-soft">{section.criterion} • {gapQuestions.length} gap{gapQuestions.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-ink-soft">
                            <span className="font-medium text-ink bg-cream px-2 py-0.5 rounded">{pct}% reported Yes</span>
                            <HelpCircle className={`w-5 h-5 ${isExpanded ? 'rotate-180' : ''} transition-transform`} />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-line animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="space-y-3">
                              {gapQuestions.map(q => (
                                <div key={q.id} className="p-3 bg-cream/50 rounded-lg border border-line">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-cream text-ink-faint">{q.criterion}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                          q.difficulty === 'hard' ? 'bg-orange-50 text-orange-700' :
                                          q.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                          'bg-cream text-ink-faint'
                                        }`}>
                                          {q.difficulty}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                          answers[q.id] === 'no' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                                        }`}>
                                          {answers[q.id] === 'no' ? 'Gap' : 'Unknown'}
                                        </span>
                                      </div>
                                      <p className="text-sm text-ink">{q.question}</p>
                                      {q.evidenceHint && (
                                        <p className="text-xs text-ink-soft mt-1">
                                          <strong>Evidence:</strong> {q.evidenceHint}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </FadeIn>
            </div>

            <aside className="space-y-6">
              <FadeIn delay={0.3} className="bg-paper rounded-xl border border-line p-6 sticky top-24">
                <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet" />
                  Next Steps
                </h3>
                <div className="space-y-3">
                  {totalGaps > 0 && (
                    <Link
                      to="/contact"
                      className="block w-full px-4 py-3 bg-violet text-paper rounded-lg font-medium text-center hover:bg-violet-deep transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Book Gap Review Call
                    </Link>
                  )}
                  <Link
                    to="/services"
                    className="block w-full px-4 py-3 bg-cream text-ink rounded-lg font-medium text-center hover:bg-cream/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Explore the consulting day
                  </Link>
                  <button
                    onClick={downloadReport}
                    className="w-full px-4 py-3 border border-line text-ink rounded-lg font-medium hover:bg-cream transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Full Report
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-line">
                  <p className="text-sm text-ink-soft mb-3">
                    <strong>What happens next:</strong>
                  </p>
                  <ul className="space-y-2 text-sm text-ink-soft">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Your gap report is saved and linked to your email
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Our team reviews gaps before any call
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      30-minute call: we walk through top 5 priorities
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      You decide if a $2,000 consulting day fits
                    </li>
                  </ul>
                </div>
              </FadeIn>
            </aside>
          </FadeIn>
        </main>
      </div>
    </Layout>
  );
}
