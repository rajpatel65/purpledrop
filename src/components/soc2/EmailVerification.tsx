import { useState, useRef, useEffect } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { FadeIn } from '../FadeIn';

interface EmailVerificationProps {
  onVerified: () => void;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  error: string | null;
  status: 'idle' | 'verifying' | 'error';
}

export function EmailVerification({ onVerified, sendCode, verifyCode, error, status }: EmailVerificationProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const codeInputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    try {
      await sendCode(email);
      setCodeSent(true);
      setCooldown(60);
    } catch {}
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    try {
      await verifyCode(code);
      onVerified();
    } catch {}
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newCode = code.split('');
    newCode[index] = value;
    const joined = newCode.join('');
    setCode(joined);

    if (value && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }

    if (joined.length === 6) {
      codeInputsRef.current[5]?.blur();
    }
  };

  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6 - index);
    if (!pasted) return;

    const newCode = code.split('');
    pasted.split('').forEach((char, i) => {
      newCode[index + i] = char;
    });
    const joined = newCode.join('');
    setCode(joined);

    const nextIndex = Math.min(index + pasted.length, 5);
    codeInputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const resendCode = async () => {
    if (cooldown > 0) return;
    try {
      await sendCode(email);
      setCooldown(60);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-cream/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <FadeIn className="bg-paper rounded-2xl shadow-soft border border-line p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-violet-tint text-violet mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-semibold text-ink">SOC2 Security Readiness Assessment</h1>
            <p className="text-ink-soft mt-2">Legacy self-assessment. Not an audit, attestation or certification. Verify your email to begin; progress is saved automatically. This is not part of the AI visibility offers.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!codeSent ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink-soft mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value.toLowerCase())}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent text-ink bg-paper placeholder:text-ink-faint"
                    disabled={status === 'verifying'}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={status === 'verifying' || !email.includes('@')}
                className="w-full py-3 bg-violet text-paper rounded-lg font-medium hover:bg-violet-deep focus:outline-none focus:ring-2 focus:ring-violet focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'verifying' ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1">
                  Enter 6-digit code sent to <span className="text-violet">{email}</span>
                </label>
              </div>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    ref={el => { codeInputsRef.current[i] = el!; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code[i] || ''}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onPaste={e => handlePaste(e, i)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    className="w-12 h-14 text-center text-2xl font-mono border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent transition-all bg-paper
                      ${code[i] ? 'border-violet bg-violet-tint' : 'border-line'}
                      ${code.length > i ? 'border-violet' : ''}"
                    autoComplete="one-time-code"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={status === 'verifying' || code.length !== 6}
                className="w-full py-3 bg-violet text-paper rounded-lg font-medium hover:bg-violet-deep focus:outline-none focus:ring-2 focus:ring-violet focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'verifying' ? 'Verifying...' : 'Verify & Start Assessment'}
              </button>

              <button
                type="button"
                onClick={resendCode}
                disabled={cooldown > 0}
                className="w-full py-2 text-sm text-ink-soft hover:text-ink disabled:opacity-50"
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Didn\'t receive a code? Resend'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-line">
            <p className="text-xs text-ink-faint text-center">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-violet hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" className="text-violet hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
