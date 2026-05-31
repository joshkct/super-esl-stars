'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, RotateCcw } from 'lucide-react';
import { useOTPVerification } from '@/lib/hooks/useOTPVerification';
import { cn } from '@/lib/utils';

const LENGTH = 6;
const MAX_ATTEMPTS = 3;
const RESEND_COOLDOWN = 60;
const EXPIRY_MINUTES = 15;

export interface OTPInputProps {
  /** Called with the full 6-digit code once all boxes are filled. */
  onComplete: (code: string) => void;
  /** Called when the user requests a fresh code (resend). */
  onReset: () => void;
  /** Disables the inputs (e.g. while the parent verifies the code). */
  disabled: boolean;
  /** Parent-supplied error message (invalid code, network error, etc.). */
  error: string | null;
}

/**
 * Six-box numeric OTP entry with auto-advance, backspace navigation and paste
 * support. Delegates all countdown/cooldown/attempt logic to
 * `useOTPVerification`. Fully keyboard accessible; errors are announced via
 * `role="alert"`.
 */
export function OTPInput({ onComplete, onReset, disabled, error }: OTPInputProps) {
  const t = useTranslations('auth.otp');
  const [digits, setDigits] = useState<string[]>(() => Array(LENGTH).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const prevError = useRef<string | null>(null);

  const {
    formattedExpiry,
    expired,
    attemptsExceeded,
    resendSeconds,
    canResend,
    recordAttempt,
    reset,
  } = useOTPVerification({
    maxAttempts: MAX_ATTEMPTS,
    resendCooldown: RESEND_COOLDOWN,
    expiryMinutes: EXPIRY_MINUTES,
  });

  const locked = disabled || attemptsExceeded || expired;

  const focusBox = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const clearBoxes = (refocus: boolean) => {
    setDigits(Array(LENGTH).fill(''));
    if (refocus) focusBox(0);
  };

  // Focus the first box on mount.
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // When a new error arrives from the parent, clear the boxes so the user can
  // retry (unless they've been locked out, in which case we keep them empty).
  useEffect(() => {
    if (error && error !== prevError.current) {
      setDigits(Array(LENGTH).fill(''));
      if (!attemptsExceeded) {
        inputsRef.current[0]?.focus();
      }
    }
    prevError.current = error;
  }, [error, attemptsExceeded]);

  const submit = (code: string) => {
    if (locked) return;
    recordAttempt();
    onComplete(code);
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;

    const next = [...digits];
    // Take the last typed character (handles overtype on a filled box).
    next[index] = raw[raw.length - 1];
    setDigits(next);

    if (index < LENGTH - 1) focusBox(index + 1);

    if (next.every((d) => d !== '')) submit(next.join(''));
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        next[index - 1] = '';
        setDigits(next);
        focusBox(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight' && index < LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;

    const next = Array(LENGTH).fill('');
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    setDigits(next);

    const lastIndex = Math.min(pasted.length, LENGTH) - 1;
    focusBox(lastIndex);

    if (next.every((d) => d !== '')) submit(next.join(''));
  };

  const handleResend = () => {
    reset();
    clearBoxes(true);
    onReset();
  };

  // Message precedence: lock-out > expiry > parent error.
  const message = attemptsExceeded
    ? t('tooManyAttempts')
    : expired
      ? t('expired')
      : error;

  return (
    <div>
      <div className="flex justify-between gap-2" role="group" aria-label={t('title')}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            disabled={locked}
            aria-label={t('digitLabel', { position: index + 1 })}
            aria-invalid={!!message}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              'h-14 w-full rounded-lg border text-center font-serif text-2xl font-bold text-ink transition-colors',
              'focus:border-gold focus:outline-none',
              message ? 'border-red-400' : 'border-ink/20',
              locked && 'cursor-not-allowed bg-ink/5 opacity-60',
            )}
          />
        ))}
      </div>

      {/* Status / error line */}
      <div className="mt-3 min-h-[1.25rem] text-sm" aria-live="polite">
        {message ? (
          <p role="alert" className="text-red-600">
            {message}
          </p>
        ) : disabled ? (
          <p className="flex items-center gap-2 text-text-secondary">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            {t('verifying')}
          </p>
        ) : (
          <p className="text-text-secondary">
            {t('expiresIn', { time: formattedExpiry })}
          </p>
        )}
      </div>

      {/* Resend */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className={cn(
            'inline-flex items-center gap-2 text-sm font-semibold transition-colors',
            canResend
              ? 'text-ink hover:text-gold'
              : 'cursor-not-allowed text-text-secondary',
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {canResend ? t('resend') : t('resendIn', { seconds: resendSeconds })}
        </button>
      </div>
    </div>
  );
}
