'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { completeProfile } from '@/lib/actions/auth';
import { completeProfileSchema, emailSchema } from '@/lib/validations';
import { locales, localeLabels } from '@/i18n/config';
import { type EnglishLevel } from '@/types';
import { OTPInput } from './OTPInput';
import { LevelSelector } from './LevelSelector';
import { StepProgress } from './StepProgress';
import { cn } from '@/lib/utils';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

type Step = 'email' | 'otp' | 'profile';
const STEP_INDEX: Record<Step, number> = { email: 0, otp: 1, profile: 2 };

const emailStepSchema = z.object({
  email: emailSchema,
  consent: z.boolean().refine((v) => v === true, {
    message: 'Consent is required to continue.',
  }),
});
type EmailStepValues = z.infer<typeof emailStepSchema>;

const profileStepSchema = completeProfileSchema.pick({
  firstName: true,
  lastName: true,
});
type ProfileStepValues = z.infer<typeof profileStepSchema>;

/**
 * Three-step inline sign-up: email + consent, OTP verification, profile setup.
 * Steps are local state with slide-in transitions and a dot progress
 * indicator. Profile data is persisted through the `completeProfile` server
 * action (service role) — never written directly from the browser.
 */
export function SignUpForm({ initialStep }: { initialStep?: Step }) {
  const t = useTranslations('auth.signUp');
  const tOtp = useTranslations('auth.otp');
  const tErr = useTranslations('auth.errors');
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [step, setStep] = useState<Step>(initialStep ?? 'email');
  const [email, setEmail] = useState('');
  const [consentAt, setConsentAt] = useState<string | null>(null);
  const [level, setLevel] = useState<EnglishLevel | null>(null);
  const [language, setLanguage] = useState<string>('en');

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const emailForm = useForm<EmailStepValues>({
    resolver: zodResolver(emailStepSchema),
    mode: 'onChange',
    defaultValues: { email: '', consent: false },
  });

  const profileForm = useForm<ProfileStepValues>({
    resolver: zodResolver(profileStepSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  const sendCode = (target: string) =>
    supabase.auth.signInWithOtp({
      email: target,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${SITE_URL}/auth/callback`,
      },
    });

  const onContinue = emailForm.handleSubmit(async ({ email: enteredEmail }) => {
    setEmailError(null);
    setSending(true);
    // Capture the consent timestamp at the moment the user proceeds.
    const timestamp = new Date().toISOString();
    const { error } = await sendCode(enteredEmail);
    setSending(false);

    if (error) {
      setEmailError(tErr('sendCodeFailed'));
      return;
    }
    setEmail(enteredEmail);
    setConsentAt(timestamp);
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
    setStep('profile');
  };

  const onResend = async () => {
    setOtpError(null);
    await sendCode(email);
  };

  const onCompleteProfile = profileForm.handleSubmit(
    async ({ firstName, lastName }) => {
      if (!level) {
        setProfileError(tErr('profileFailed'));
        return;
      }
      setProfileError(null);
      setCompleting(true);
      const result = await completeProfile({
        firstName,
        lastName,
        englishLevel: level,
        languagePreference: language,
        consentGiven: true,
        // Fall back to now() for the magic-link path where step-1 state is lost.
        consentAt: consentAt ?? new Date().toISOString(),
      });
      setCompleting(false);

      if (!result.ok) {
        setProfileError(tErr('profileFailed'));
        return;
      }
      router.replace('/welcome');
    },
  );

  return (
    <div>
      <div className="mb-8">
        <StepProgress total={3} current={STEP_INDEX[step]} />
      </div>

      {step === 'email' && (
        <div className="animate-step">
          <h1 className="font-serif text-3xl font-bold text-ink">{t('title')}</h1>
          <p className="mt-2 text-text-secondary">{t('subtitle')}</p>

          <form onSubmit={onContinue} noValidate className="mt-8">
            <label htmlFor="signup-email" className="text-sm font-semibold text-ink">
              {t('emailLabel')}
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder={t('emailPlaceholder')}
              aria-invalid={!!emailForm.formState.errors.email}
              className={cn(
                'mt-1.5 w-full rounded-lg border bg-surface px-4 py-3 text-ink placeholder:text-text-secondary/60 transition-colors focus:outline-none',
                emailForm.formState.errors.email
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-ink/20 focus:border-gold',
              )}
              {...emailForm.register('email')}
            />
            {emailForm.formState.errors.email && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {emailForm.formState.errors.email.message}
              </p>
            )}

            <label className="mt-5 flex items-start gap-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 flex-none rounded border-ink/30 text-gold focus:ring-gold"
                {...emailForm.register('consent')}
              />
              <span>
                {t.rich('consent', {
                  privacy: (chunks) => (
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink underline"
                    >
                      {chunks}
                    </Link>
                  ),
                  terms: (chunks) => (
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink underline"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </label>

            {emailError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {emailError}
              </p>
            )}

            <button
              type="submit"
              disabled={!emailForm.formState.isValid || sending}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {t('continue')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            {t('haveAccountQuestion')}{' '}
            <Link href="/sign-in" className="font-semibold text-ink hover:text-gold">
              {t('haveAccountLink')}
            </Link>
          </p>
        </div>
      )}

      {step === 'otp' && (
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
      )}

      {step === 'profile' && (
        <div className="animate-step">
          <h1 className="font-serif text-3xl font-bold text-ink">
            {t('profileTitle')}
          </h1>
          <p className="mt-2 text-text-secondary">{t('profileSubtitle')}</p>

          <form onSubmit={onCompleteProfile} noValidate className="mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="text-sm font-semibold text-ink">
                  {t('firstNameLabel')}
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  autoFocus
                  placeholder={t('firstNamePlaceholder')}
                  aria-invalid={!!profileForm.formState.errors.firstName}
                  className={cn(
                    'mt-1.5 w-full rounded-lg border bg-surface px-4 py-3 text-ink placeholder:text-text-secondary/60 transition-colors focus:outline-none',
                    profileForm.formState.errors.firstName
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-ink/20 focus:border-gold',
                  )}
                  {...profileForm.register('firstName')}
                />
                {profileForm.formState.errors.firstName && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="text-sm font-semibold text-ink">
                  {t('lastNameLabel')}
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder={t('lastNamePlaceholder')}
                  aria-invalid={!!profileForm.formState.errors.lastName}
                  className={cn(
                    'mt-1.5 w-full rounded-lg border bg-surface px-4 py-3 text-ink placeholder:text-text-secondary/60 transition-colors focus:outline-none',
                    profileForm.formState.errors.lastName
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-ink/20 focus:border-gold',
                  )}
                  {...profileForm.register('lastName')}
                />
                {profileForm.formState.errors.lastName && (
                  <p role="alert" className="mt-1 text-sm text-red-600">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-ink">
                {t('levelLabel')}
              </legend>
              <div className="mt-2">
                <LevelSelector value={level} onChange={setLevel} />
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="language" className="text-sm font-semibold text-ink">
                {t('languageLabel')}
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-ink/20 bg-surface px-4 py-3 text-ink transition-colors focus:border-gold focus:outline-none"
              >
                {locales.map((locale) => (
                  <option key={locale} value={locale}>
                    {localeLabels[locale]}
                  </option>
                ))}
              </select>
            </div>

            {profileError && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {profileError}
              </p>
            )}

            <button
              type="submit"
              disabled={completing}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {completing && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {completing ? t('completing') : t('completeSetup')}
            </button>

            <button
              type="button"
              onClick={() => router.replace('/welcome')}
              className="mt-4 w-full text-center text-sm font-semibold text-text-secondary transition-colors hover:text-ink"
            >
              {t('skipForNow')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
