import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only initialize when configured. createClient('', '') throws at import time,
// which would blank the lazily-loaded SOC2 page entirely when env vars are
// missing — demo mode (soc2-api.ts) is the intended fallback in that case.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type AssessmentStatus = 'started' | 'in_progress' | 'completed' | 'abandoned';

export interface AssessmentSession {
  id: string;
  user_id: string;
  email: string;
  status: AssessmentStatus;
  current_section: string;
  answers: Record<string, 'yes' | 'no' | 'dont_know'>;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  last_assessment_at: string | null;
}

export interface LeadSignal {
  id: string;
  session_id: string;
  question_id: string;
  answer: 'no' | 'dont_know';
  section: string;
  criterion: string;
  created_at: string;
}