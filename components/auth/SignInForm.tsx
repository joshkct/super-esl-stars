'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { signInSchema, type SignInInput } from '@/lib/validations';
import { OTPInput } from './OTPInput';
import { cn } from '@/lib/utils';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
const REDIRECT_KEY = 'verbjective_redirect';

type Step = 'email' | 'otp';

/**
 * Two-step inline sign-in: email entry then OTP verification. No navigation
 * between steps — state is local and the OTP step slides in. Uses the browser
 * Supabase client for OTP send/verify; the role lookup after success is a
 * read-only, RLS-protected query.
 */
export function SignInForm({ initialRedirect }: { initialRedirect?: string }) {
  const t = useTranslations('auth.signIn');
  const tOtp = useTranslations('auth.otp');
  const tErr = useTranslations('auth.errors');
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showNoAccount, setShowNoAccount] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '' },
  });

  // Persist any middleware-provided redirect target so we can honour it after
  // successful verification.
  useEffect(() => {
    if (initialRedirect) sessionStorage.setItem(REDIRECT_KEY, initialRedirect);
  }, [initialRedirect]);

  const sendCode = async (target: string) => {
    return supabase.auth.signInWithOtp({
      email: target,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${SITE_URL}/auth/callback`,
      },
    });
  };

  const onSendCode = handleSubmit(async ({ email: enteredEmail }) => {
    setEmailError(null);
    setShowNoAccount(false);
    setSending(true);
    const { error } = await sendCode(enteredEmail);
    setSending(false);

    if (error) {
      // Rate limits surface a generic message; everything else with
      // shouldCreateUser:false means there is no account for this address.
      if (error.status === 429) setEmailError(tErr('sendCodeFailed'));
      else setShowNoAccount(true);
      return;
    }

    setEmail(enteredEmail);
    setOtpError(null);
    setStep('otp');
  });

  const onVerify = async (code: string) => {
    setOtpError(null);
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    setVerifying(false);

    if (error) {
      if (error.code === 'otp_expired' || /expired/i.test(error.message)) {
        setOtpError(tOtp('expired'));
      } else {
        setOtpError(tErr('invalidCode'));
      }
      return;
    }

    // Determine destination from role + any stored redirect.
    let destination = '/dashboard/student';
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle<{ role: 'student' | 'tutor' }>();

      if (profile?.role === 'tutor') {
        destination = '/dashboard/tutor';
      } else {
        const stored = sessionStorage.getItem(REDIRECT_KEY);
        if (stored) destination = stored;
      }
    }
    sessionStorage.removeItem(REDIRECT_KEY);
    router.replace(destination);
  };

  const onResend = async () => {
    setOtpError(null);
    await sendCode(email);
  };

  if (step === 'otp') {
    return (
      <div className="animate-step">
        <button
          type="button"
          onClick={() => setStep('email')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {tOtp('back')}
        </button>

        <h1 className="font-serif text-3xl font-bold text-ink">{tOtp('title')}</h1>
        <p className="mt-2 text-text-secondary">
          {tOtp('sentTo')}{' '}
          <span className="font-semibold text-gold">{email}</span>
        </p>

        <div className="mt-8">
          <OTPInput
            onComplete={onVerify}
            onReset={onResend}
            disabled={verifying}
            error={otpError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-step">
      <h1 className="font-serif text-3xl font-bold text-ink">{t('title')}</h1>
      <p className="mt-2 text-text-secondary">{t('subtitle')}</p>

      <form onSubmit={onSendCode} noValidate className="mt-8">
        <label htmlFor="signin-email" className="text-sm font-semibold text-ink">
          {t('emailLabel')}
        </label>
        <input
          id="signin-email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder={t('emailPlaceholder')}
          aria-invalid={!!errors.email}
          className={cn(
            'mt-1.5 w-full rounded-lg border bg-surface px-4 py-3 text-ink placeholder:text-text-secondary/60 transition-colors focus:outline-none',
            errors.email ? 'border-red-400 focus:border-red-500' : 'border-ink/20 focus:border-gold',
          )}
          {...register('email')}
        />
        {errors.email && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}

        {emailError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {emailError}
          </p>
        )}

        {showNoAccount && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {t('notFound')}{' '}
            <Link href="/sign-up" className="font-semibold underline">
              {t('notFoundLink')}
            </Link>
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {sending ? t('sending') : t('sendCode')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        {t('noAccountQuestion')}{' '}
        <Link href="/sign-up" className="font-semibold text-ink hover:text-gold">
          {t('noAccountLink')}
        </Link>
      </p>
    </div>
  );
}
