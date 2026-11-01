import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { soc2Api, calculateStats, calculateSectionStats, SOC2_SECTIONS, getSectionQuestions } from '../lib/soc2-api';

export type Answer = 'yes' | 'no' | 'dont_know';

export interface AssessmentState {
  email: string;
  verified: boolean;
  sessionId: string | null;
  currentSectionIndex: number;
  answers: Record<string, Answer>;
  status: 'idle' | 'verifying' | 'assessing' | 'saving' | 'complete' | 'error';
  error: string | null;
}

const STORAGE_KEYS = {
  SESSION: 'soc2_session',
  ANSWERS: 'soc2_answers',
  EMAIL: 'soc2_email',
  VERIFIED: 'soc2_verified',
  LEAD_SIGNALS: 'soc2_lead_signals',
} as const;

function initialState(): AssessmentState {
  return {
    email: '',
    verified: false,
    sessionId: null,
    currentSectionIndex: 0,
    answers: {},
    status: 'idle',
    error: null,
  };
}

export function useSoc2Assessment() {
  const navigate = useNavigate();

  // Always start with a clean state so server-rendered HTML and the first
  // client render match (prerender hydration). Returning sessions are
  // re-loaded from localStorage right after hydration, below.
  const [state, setState] = useState<AssessmentState>(initialState);

  useEffect(() => {
    try {
      const verified = localStorage.getItem(STORAGE_KEYS.VERIFIED) === 'true';
      const email = localStorage.getItem(STORAGE_KEYS.EMAIL) || '';
      if (verified && email) {
        let session: { id?: string } | null = null;
        try {
          session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
        } catch {
          session = null;
        }
        let answers: Record<string, Answer> = {};
        try {
          answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');
        } catch {
          answers = {};
        }
        setState({
          email,
          verified: true,
          sessionId: session?.id || null,
          currentSectionIndex: 0,
          answers,
          status: 'assessing',
          error: null,
        });
      }
    } catch {
      // storage unavailable (private mode etc.) — start clean
    }
  }, []);

  const persist = useCallback((newState: Partial<AssessmentState>) => {
    setState(prev => {
      const merged = { ...prev, ...newState };
      // Sync to both state and localStorage (API keys)
      if (merged.email) localStorage.setItem(STORAGE_KEYS.EMAIL, merged.email);
      if (merged.verified !== undefined) localStorage.setItem(STORAGE_KEYS.VERIFIED, String(merged.verified));
      if (merged.sessionId) {
        const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
        if (session) {
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ ...session, id: merged.sessionId }));
        }
      }
      if (merged.answers) localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(merged.answers));
      return merged;
    });
  }, []);

  const clearPersisted = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    setState(initialState());
  }, []);

  const sendVerificationCode = useCallback(async (email: string) => {
    const normalized = email.toLowerCase().trim();
    persist({ email: normalized, status: 'verifying', error: null });
    try {
      await soc2Api.sendVerificationCode(normalized);
      persist({ status: 'verifying' });
    } catch (err) {
      persist({ error: err instanceof Error ? err.message : 'Failed to send code', status: 'idle' });
      throw err;
    }
  }, [persist]);

  const verifyCode = useCallback(async (code: string) => {
    const { email } = state;
    if (!email) return;

    persist({ status: 'verifying', error: null });
    try {
      await soc2Api.verifyCode(email, code);
      const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
      const answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '{}');
      persist({
        verified: true,
        status: 'assessing',
        sessionId: session?.id || null,
        answers,
      });
    } catch (err) {
      persist({ error: err instanceof Error ? err.message : 'Invalid code', status: 'verifying' });
      throw err;
    }
  }, [state.email, persist]);

  const answerQuestion = useCallback((questionId: string, answer: Answer) => {
    setState(prev => {
      const newAnswers = { ...prev.answers, [questionId]: answer };
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(newAnswers));
      return { ...prev, answers: newAnswers };
    });
  }, []);

  const saveProgress = useCallback(async (status: 'in_progress' | 'completed' = 'in_progress') => {
    const { sessionId, answers, currentSectionIndex } = state;
    if (!sessionId) return;

    persist({ status: 'saving' });
    try {
      await soc2Api.saveAssessment({
        sessionId,
        answers,
        currentSection: SOC2_SECTIONS[currentSectionIndex].id,
        status,
      });
      persist({ status: status === 'completed' ? 'complete' : 'assessing' });
      if (status === 'completed') {
        clearPersisted();
        navigate('/soc2/results', { state: { sessionId } });
      }
    } catch (err) {
      persist({ error: 'Failed to save progress', status: 'assessing' });
      throw err;
    }
  }, [state, persist, clearPersisted, navigate]);

  const goToSection = useCallback((index: number) => {
    if (index >= 0 && index < SOC2_SECTIONS.length) {
      persist({ currentSectionIndex: index });
    }
  }, [persist]);

  const nextSection = useCallback(() => {
    const { currentSectionIndex } = state;
    if (currentSectionIndex < SOC2_SECTIONS.length - 1) {
      persist({ currentSectionIndex: currentSectionIndex + 1 });
    }
  }, [state.currentSectionIndex, persist]);

  const prevSection = useCallback(() => {
    const { currentSectionIndex } = state;
    if (currentSectionIndex > 0) {
      persist({ currentSectionIndex: currentSectionIndex - 1 });
    }
  }, [state.currentSectionIndex, persist]);

  const currentSection = SOC2_SECTIONS[state.currentSectionIndex];
  const currentQuestions = currentSection
    ? getSectionQuestions(currentSection.id)
    : [];

  const sectionProgressMap = useMemo(() => {
    const map: Record<string, { answered: number; total: number; gaps: number }> = {};
    SOC2_SECTIONS.forEach(section => {
      map[section.id] = calculateSectionStats(state.answers, section.id);
    });
    return map;
  }, [state.answers]);

  const sectionProgress = currentSection
    ? calculateSectionStats(state.answers, currentSection.id)
    : { answered: 0, total: 0, gaps: 0 };

  const overallStats = calculateStats(state.answers);

  const canProceed = sectionProgress.answered === sectionProgress.total;

  return {
    state,
    sections: SOC2_SECTIONS,
    currentSection,
    currentSectionIndex: state.currentSectionIndex,
    currentQuestions,
    sectionProgress,
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
    setError: (error: string | null) => persist({ error }),
  };
}