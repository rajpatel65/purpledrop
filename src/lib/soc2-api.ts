import { supabase } from './supabase';
import { SOC2_QUESTIONS, SOC2_SECTIONS, getQuestionsBySection, getOverallStats, getSectionProgress } from './soc2-questions';

const FUNCTIONS_URL = (import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ||
  (import.meta.env.VITE_SUPABASE_URL ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1` : '')).replace(/\/$/, '');
// Demo verification is opt-in and never enabled in a production build.
const DEMO_MODE = import.meta.env.DEV && import.meta.env.VITE_SOC2_DEMO_MODE === 'true';
const USE_SUPABASE = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

const STORAGE_KEYS = {
  SESSION: 'soc2_session',
  ANSWERS: 'soc2_answers',
  EMAIL: 'soc2_email',
  VERIFIED: 'soc2_verified',
  LEAD_SIGNALS: 'soc2_lead_signals',
} as const;

const LEAD_ENDPOINT = `${(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')}/functions/v1/submit-lead`;

// Demo-mode safety net: if Supabase env vars aren't configured on the deployed
// site, relays the lead to the submit-lead endpoint so SOC2 completions are
// never silently lost in localStorage. Errors are swallowed — never block the
// user flow. Needs VITE_SUPABASE_URL to know where the function lives; without
// it there is nowhere to relay to.
async function relayFallbackLead(payload: Record<string, unknown>) {
  try {
    if (!import.meta.env.VITE_SUPABASE_URL) return false;
    await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, form: 'soc2-fallback' }),
    });
    return true;
  } catch {
    return false;
  }
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function request(path: string, options: RequestInit = {}) {
  if (!USE_SUPABASE || !supabase) {
    throw new Error('Supabase not configured');
  }

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${FUNCTIONS_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

function getLocalSession() {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

function setLocalSession(session: any) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function setLocalAnswers(answers: Record<string, 'yes' | 'no' | 'dont_know'>) {
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
}

export const soc2Api = {
  async sendVerificationCode(email: string) {
    if (USE_SUPABASE) {
      return request('/send-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    }

    if (!DEMO_MODE) throw new Error('Email verification is not configured. Please contact purpleDrop or try again later.');

    // Local development only: store code in localStorage
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`soc2_code_${email.toLowerCase()}`, JSON.stringify({
      code,
      expires: Date.now() + 10 * 60 * 1000,
    }));
    console.log(`[DEMO] Verification code for ${email}: ${code}`);
    return { success: true };
  },

  async verifyCode(email: string, code: string) {
    if (USE_SUPABASE) {
      const result = await request('/verify-code', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });
      if (!result.session?.access_token || !result.session?.refresh_token) {
        throw new Error('Verification did not create a session. Please request a new code.');
      }
      const { error } = await supabase!.auth.setSession(result.session);
      if (error) throw new Error('Could not save your session. Please request a new code.');
      return result;
    }

    if (!DEMO_MODE) throw new Error('Email verification is not configured.');

    // Local development only: check localStorage
    const stored = localStorage.getItem(`soc2_code_${email.toLowerCase()}`);
    if (!stored) throw new Error('No code sent');

    const { code: storedCode, expires } = JSON.parse(stored);
    if (Date.now() > expires) throw new Error('Code expired');
    if (storedCode !== code) throw new Error('Invalid code');

    localStorage.removeItem(`soc2_code_${email.toLowerCase()}`);
    localStorage.setItem(STORAGE_KEYS.EMAIL, email.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.VERIFIED, 'true');

    // Demo-mode fallback: notify that a verified lead exists even without Supabase
    const lowerEmail = email.toLowerCase();
    const relayedKey = `soc2_relayed_${lowerEmail}`;
    if (!localStorage.getItem(relayedKey)) {
      localStorage.setItem(relayedKey, 'true');
      void relayFallbackLead({
        type: 'soc2_assessment',
        email: lowerEmail,
        status: 'started',
        source: 'soc2-verify-fallback',
      });
    }

    // Create session
    const sessionId = generateId();
    const session = {
      id: sessionId,
      email: email.toLowerCase(),
      status: 'started',
      current_section: SOC2_SECTIONS[0].id,
      answers: {},
      started_at: new Date().toISOString(),
      completed_at: null,
    };
    setLocalSession(session);

    return { success: true, email: email.toLowerCase() };
  },

  async saveAssessment(data: {
    sessionId?: string;
    answers: Record<string, 'yes' | 'no' | 'dont_know'>;
    currentSection: string;
    status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  }) {
    if (USE_SUPABASE) {
      return request('/assessment', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }

    // Demo mode: save to localStorage
    const session = getLocalSession() || { id: generateId() };
    const updatedSession = {
      ...session,
      ...data,
      updated_at: new Date().toISOString(),
    };
    setLocalSession(updatedSession);
    setLocalAnswers(data.answers);

    // Track lead signals
    const signals = [];
    for (const [questionId, answer] of Object.entries(data.answers)) {
      if (answer === 'no' || answer === 'dont_know') {
        const question = SOC2_QUESTIONS.find(q => q.id === questionId);
        if (question) {
          signals.push({
            id: generateId(),
            session_id: updatedSession.id,
            question_id: questionId,
            answer,
            section: question.section,
            criterion: question.criterion,
            created_at: new Date().toISOString(),
          });
        }
      }
    }
    if (signals.length > 0) {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAD_SIGNALS) || '[]');
      localStorage.setItem(STORAGE_KEYS.LEAD_SIGNALS, JSON.stringify([...existing, ...signals]));
    }

    // Demo-mode fallback: relay a completed assessment once, so the lead is
    // captured even if Supabase env vars are missing in production.
    if (data.status === 'completed') {
      const completedKey = `soc2_relayed_complete_${updatedSession.id}`;
      if (!localStorage.getItem(completedKey)) {
        localStorage.setItem(completedKey, 'true');
        void relayFallbackLead({
          type: 'soc2_assessment',
          email: (session as { email?: string }).email || localStorage.getItem(STORAGE_KEYS.EMAIL) || '',
          status: 'completed',
          session_id: updatedSession.id,
          answers: data.answers,
          source: 'soc2-complete-fallback',
        });
      }
    }

    return { success: true, session: updatedSession };
  },

  async getAssessment(sessionId: string) {
    if (USE_SUPABASE) {
      return request(`/assessment?sessionId=${sessionId}`);
    }

    const session = getLocalSession();
    if (!session || session.id !== sessionId) {
      throw new Error('Not found');
    }
    return { session };
  },

  async listAssessments() {
    if (USE_SUPABASE) {
      return request('/assessment');
    }

    const session = getLocalSession();
    return { sessions: session ? [session] : [] };
  },
};

export function getSectionQuestions(sectionId: string) {
  return getQuestionsBySection(sectionId);
}

export function getAllSections() {
  return SOC2_SECTIONS;
}

export function calculateStats(answers: Record<string, 'yes' | 'no' | 'dont_know'>) {
  return getOverallStats(answers);
}

export function calculateSectionStats(
  answers: Record<string, 'yes' | 'no' | 'dont_know'>,
  sectionId: string
) {
  return getSectionProgress(answers, sectionId);
}

export { SOC2_QUESTIONS, SOC2_SECTIONS };
