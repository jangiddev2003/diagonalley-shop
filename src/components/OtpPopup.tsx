// ============================================
// OTP POPUP — 3-Step Password Reset Wizard
// ============================================
// Step 1: User enters their registered email → sends OTP (displayed on screen for dev)
// Step 2: User enters the 6-digit OTP they received
// Step 3: User sets a new password
//
// All API calls go through src/services/api.ts → real backend.

import { useState, useRef, useEffect } from 'react';
import { X, Mail, KeyRound, Lock, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { authApi } from '@/services/api';

interface OtpPopupProps {
  onClose: () => void;
  /** Optional: called after a successful password reset (e.g. to auto-focus email input) */
  onSuccess?: () => void;
}

type Step = 'email' | 'otp' | 'password' | 'done';

const OTP_LENGTH = 6;

// ── Small helper: countdown display ──────────────────────────────────
const useCountdown = (seconds: number) => {
  const [remaining, setRemaining] = useState(seconds);
  const [active, setActive]       = useState(false);

  const start = () => { setRemaining(seconds); setActive(true); };
  const reset = () => { setRemaining(seconds); setActive(false); };

  useEffect(() => {
    if (!active) return;
    if (remaining <= 0) { setActive(false); return; }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [active, remaining]);

  return { remaining, active, start, reset };
};

// ─────────────────────────────────────────────────────────────────────
const OtpPopup = ({ onClose, onSuccess }: OtpPopupProps) => {
  const [step,        setStep]        = useState<Step>('email');
  const [email,       setEmail]       = useState('');
  const [displayOtp,  setDisplayOtp]  = useState(''); // For showing OTP in dev mode
  const [otp,         setOtp]         = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPwd,  setConfirmPwd]  = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState('');
  const [info,        setInfo]        = useState('');

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const countdown = useCountdown(300); // 5-min OTP countdown

  // Auto-focus first OTP box when step changes
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
      countdown.start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const clearMessages = () => { setError(''); setInfo(''); };

  // ── STEP 1: Send OTP ───────────────────────────────────────────────
  const handleSendOtp = async () => {
    clearMessages();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your registered email address.');
      return;
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.sendOtp(trimmed);
      if (res.success) {
        setDisplayOtp(res.otp || ''); // Show OTP in dev mode
        setInfo(res.message);
        setStep('otp');
      } else {
        setError(res.message);
      }
    } catch {
      setError('Could not reach the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── STEP 2: Verify OTP ────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    clearMessages();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits of your OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp(email.trim(), code);
      if (res.success) {
        countdown.reset();
        setStep('password');
      } else {
        setError(res.message);
      }
    } catch {
      setError('Could not reach the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── STEP 3: Reset Password ────────────────────────────────────────
  const handleResetPassword = async () => {
    clearMessages();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPwd) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword(email.trim(), newPassword);
      if (res.success) {
        setStep('done');
        onSuccess?.();
      } else {
        setError(res.message);
      }
    } catch {
      setError('Could not reach the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP digit input handlers ──────────────────────────────────────
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === 'Enter' && otp.every(d => d !== '')) {
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const arr = pasted.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH);
    setOtp(arr);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Resend OTP ────────────────────────────────────────────────────
  const handleResend = async () => {
    clearMessages();
    setOtp(Array(OTP_LENGTH).fill(''));
    setIsLoading(true);
    try {
      const res = await authApi.sendOtp(email.trim());
      if (res.success) {
        setDisplayOtp(res.otp || ''); // Show OTP in dev mode
        setInfo('New OTP sent! Check your email 🦉');
        countdown.start();
      } else {
        setError(res.message);
      }
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────
  const fmtCountdown = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const stepIcons: Record<Step, string> = {
    email:    '📧',
    otp:      '🦉',
    password: '🔑',
    done:     '✅',
  };

  const stepTitles: Record<Step, string> = {
    email:    'Forgot Your Spell?',
    otp:      'Owl Post Delivered',
    password: 'Set New Secret Spell',
    done:     'Spell Restored!',
  };

  const stepSubtitles: Record<Step, string> = {
    email:    'Enter your registered email to receive an OTP',
    otp:      `Enter the 6-digit code sent to ...${email.slice(-10)}`,
    password: 'Choose a new password for your account',
    done:     'Your password has been reset. You may now log in.',
  };

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative max-w-sm w-full rounded-2xl border border-primary/50 bg-card shadow-2xl glow-gold animate-fade-in overflow-hidden">

        {/* ── Decorative top bar ──────────────────────────────────── */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2">
            {/* Back arrow (steps 2 and 3 only) */}
            {(step === 'otp' || step === 'password') && (
              <button
                onClick={() => {
                  clearMessages();
                  setStep(step === 'otp' ? 'email' : 'otp');
                }}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors mr-1"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <span className="text-2xl">{stepIcons[step]}</span>
            <div>
              <h3 className="font-display text-base font-bold text-foreground leading-tight">
                {stepTitles[step]}
              </h3>
              <p className="text-xs text-muted-foreground font-body">{stepSubtitles[step]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Step progress dots ──────────────────────────────────── */}
        {step !== 'done' && (
          <div className="flex justify-center gap-2 pb-3">
            {(['email', 'otp', 'password'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 h-2 bg-primary'
                    : (['email', 'otp', 'password'].indexOf(step) > i)
                      ? 'w-2 h-2 bg-primary/60'
                      : 'w-2 h-2 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Messages ────────────────────────────────────────────── */}
        <div className="px-6">
          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-center animate-fade-in">
              <p className="text-xs text-destructive font-body">⚠️ {error}</p>
            </div>
          )}
          {info && !error && (
            <div className="mb-3 p-2.5 rounded-lg bg-primary/10 border border-primary/30 text-center animate-fade-in">
              <p className="text-xs text-primary font-body">✨ {info}</p>
            </div>
          )}
        </div>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div className="px-6 pb-6 space-y-4">

          {/* ── STEP 1: Email Address ───────────────────────────────── */}
          {step === 'email' && (
            <div className="animate-fade-in space-y-4">
              <div>
                <label className="block font-display text-xs font-semibold text-foreground mb-1.5">
                  <Mail className="inline h-3 w-3 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  placeholder="harry@hogwarts.edu"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm
                    font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2
                    focus:ring-primary/50 transition-all"
                />
                <p className="text-[11px] text-muted-foreground font-body mt-1.5">
                  Enter the email linked to your Hogwarts account.
                </p>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display
                  font-semibold text-sm hover:glow-gold-intense active:scale-95 transition-all
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending Owl...</>
                  : '🦉 Send OTP via Owl Post'}
              </button>
            </div>
          )}

          {/* ── STEP 2: OTP Entry ─────────────────────────────────── */}
          {step === 'otp' && (
            <div className="animate-fade-in space-y-4">
              {/* 6-digit OTP boxes */}
              <div
                className="flex justify-center gap-2"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { inputsRef.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    maxLength={1}
                    className={`w-11 h-13 text-center text-lg font-display font-bold rounded-lg border
                      bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60
                      transition-all duration-150
                      ${digit ? 'border-primary/70 shadow-[0_0_8px_hsl(var(--gold)/0.3)]' : 'border-border'}`}
                    style={{ height: '3.25rem' }}
                  />
                ))}
              </div>

              {/* Countdown */}
              <div className="text-center">
                {countdown.active && countdown.remaining > 0 ? (
                  <p className="text-xs text-muted-foreground font-body">
                    OTP expires in{' '}
                    <span className="text-primary font-semibold font-display">
                      {fmtCountdown(countdown.remaining)}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-xs text-primary hover:text-primary/80 font-body underline underline-offset-2
                      transition-colors disabled:opacity-50"
                  >
                    Resend OTP 🦉
                  </button>
                )}
              </div>

              {/* Display OTP (Dev Mode) */}
              {displayOtp && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                  <p className="text-xs text-muted-foreground font-body mb-1">Your OTP (for dev/testing):</p>
                  <p className="text-lg font-display font-bold text-primary tracking-widest">{displayOtp}</p>
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.some(d => d === '')}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display
                  font-semibold text-sm hover:glow-gold-intense active:scale-95 transition-all
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                  : <><KeyRound className="h-4 w-4" /> Verify Spell ✨</>}
              </button>
            </div>
          )}

          {/* ── STEP 3: New Password ──────────────────────────────── */}
          {step === 'password' && (
            <div className="animate-fade-in space-y-4">
              <div>
                <label className="block font-display text-xs font-semibold text-foreground mb-1.5">
                  <Lock className="inline h-3 w-3 mr-1" />
                  New Secret Spell
                </label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground
                    text-sm font-body placeholder:text-muted-foreground focus:outline-none
                    focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block font-display text-xs font-semibold text-foreground mb-1.5">
                  <Lock className="inline h-3 w-3 mr-1" />
                  Confirm Spell
                </label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground
                    text-sm font-body placeholder:text-muted-foreground focus:outline-none
                    focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              {/* Password strength indicator */}
              {newPassword && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(lvl => {
                    const strength = newPassword.length >= 12 ? 4 : newPassword.length >= 10 ? 3 : newPassword.length >= 8 ? 2 : 1;
                    const colors = ['bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
                    return (
                      <div
                        key={lvl}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${lvl <= strength ? colors[strength - 1] : 'bg-muted'}`}
                      />
                    );
                  })}
                </div>
              )}
              <label className="flex items-center gap-2 text-xs text-muted-foreground font-body cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPwd}
                  onChange={e => setShowPwd(e.target.checked)}
                  className="accent-primary"
                />
                Show password
              </label>
              <button
                onClick={handleResetPassword}
                disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPwd}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display
                  font-semibold text-sm hover:glow-gold-intense active:scale-95 transition-all
                  disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Casting Spell...</>
                  : '🔓 Reset My Spell'}
              </button>
            </div>
          )}

          {/* ── STEP 4: Done ─────────────────────────────────────── */}
          {step === 'done' && (
            <div className="animate-fade-in flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="h-14 w-14 text-green-500 animate-bounce" />
              <div>
                <p className="font-display text-base font-bold text-foreground">
                  Alohomora! 🔓
                </p>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  Your secret spell has been updated. You can now log in with your new password.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display
                  font-semibold text-sm hover:glow-gold-intense active:scale-95 transition-all"
              >
                Return to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OtpPopup;
