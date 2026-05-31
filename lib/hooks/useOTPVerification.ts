'use client';

import { useCallback, useEffect, useState } from 'react';

export interface UseOTPVerificationOptions {
  /** Maximum verification attempts before the inputs lock. */
  maxAttempts: number;
  /** Seconds the resend action stays disabled after each send. */
  resendCooldown: number;
  /** Minutes until the code expires (drives the MM:SS countdown). */
  expiryMinutes: number;
}

export interface UseOTPVerificationResult {
  /** Whole seconds left before the code expires. */
  secondsRemaining: number;
  /** Expiry countdown formatted as MM:SS. */
  formattedExpiry: string;
  /** True once the expiry countdown reaches zero. */
  expired: boolean;
  /** Number of verification attempts recorded so far. */
  attempts: number;
  /** True once attempts have reached `maxAttempts`. */
  attemptsExceeded: boolean;
  /** Seconds left on the resend cooldown. */
  resendSeconds: number;
  /** Whether the resend action is currently available. */
  canResend: boolean;
  /** Record one verification attempt (call on each full-code submission). */
  recordAttempt: () => void;
  /** Reset everything for a freshly sent code (attempts, expiry, cooldown). */
  reset: () => void;
}

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Encapsulates all time- and attempt-based logic for OTP verification:
 * the 15-minute expiry countdown, the 60-second resend cooldown, and the
 * failed-attempt limit. Timestamp-based so it stays accurate across tab
 * inactivity. UI-agnostic — consumed by the OTPInput component.
 */
export function useOTPVerification({
  maxAttempts,
  resendCooldown,
  expiryMinutes,
}: UseOTPVerificationOptions): UseOTPVerificationResult {
  const [expiryEnd, setExpiryEnd] = useState(
    () => Date.now() + expiryMinutes * 60_000,
  );
  const [cooldownEnd, setCooldownEnd] = useState(
    () => Date.now() + resendCooldown * 1_000,
  );
  const [attempts, setAttempts] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const recordAttempt = useCallback(() => setAttempts((a) => a + 1), []);

  const reset = useCallback(() => {
    const next = Date.now();
    setAttempts(0);
    setExpiryEnd(next + expiryMinutes * 60_000);
    setCooldownEnd(next + resendCooldown * 1_000);
    setNow(next);
  }, [expiryMinutes, resendCooldown]);

  const secondsRemaining = Math.max(0, Math.ceil((expiryEnd - now) / 1000));
  const resendSeconds = Math.max(0, Math.ceil((cooldownEnd - now) / 1000));
  const attemptsExceeded = attempts >= maxAttempts;

  return {
    secondsRemaining,
    formattedExpiry: format(secondsRemaining),
    expired: secondsRemaining <= 0,
    attempts,
    attemptsExceeded,
    resendSeconds,
    // Once locked out, the resend becomes available immediately.
    canResend: resendSeconds <= 0 || attemptsExceeded,
    recordAttempt,
    reset,
  };
}
