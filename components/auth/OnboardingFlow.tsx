'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Check, CheckCircle2, Loader2 } from 'lucide-react';
import { updateOnboarding } from '@/lib/actions/auth';
import { locales, localeLabels } from '@/i18n/config';
import { type EnglishLevel } from '@/types';
import { LevelSelector } from './LevelSelector';
import { StepProgress } from './StepProgress';
import { cn } from '@/lib/utils';

type Step = 'level' | 'language';

// Endonyms of languages planned for future releases (proper nouns, not UI
// chrome). Only English is currently selectable.
const UPCOMING_LANGUAGES = ['Afrikaans', 'isiZulu', 'Français', 'Português'];

/**
 * Two-step, skippable onboarding: confirm English level, then language
 * preference. Both completing and skipping persist the current values via the
 * `updateOnboarding` server action and route to the student dashboard.
 */
export function OnboardingFlow({
  initialLevel,
  initialLanguage,
}: {
  initialLevel: EnglishLevel | null;
  initialLanguage: string;
}) {
  const t = useTranslations('auth.onboarding');
  const tErr = useTranslations('auth.errors');
  const router = useRouter();

  const [step, setStep] = useState<Step>('level');
  const [level, setLevel] = useState<EnglishLevel | null>(initialLevel);
  const [language, setLanguage] = useState<string>(initialLanguage || 'en');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const finish = async () => {
    setError(null);
    setSubmitting(true);
    const result = await updateOnboarding({
      englishLevel: level ?? 'beginner',
      languagePreference: language,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(tErr('generic'));
      return;
    }
    // Briefly surface the success toast, then route to the dashboard.
    setDone(true);
    setTimeout(() => router.replace('/dashboard/student'), 1200);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      {/* Success toast */}
      {done && (
        <div
          role="status"
          className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-cream shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 text-gold" aria-hidden="true" />
          {t('successToast')}
        </div>
      )}

      <div className="w-full max-w-xl">
        <div className="mb-8">
          <StepProgress total={2} current={step === 'level' ? 0 : 1} />
        </div>

        {step === 'level' && (
          <div className="animate-step">
            <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              {t('step1Title')}
            </h1>
            <div className="mt-8">
              <LevelSelector value={level} onChange={setLevel} />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                disabled={!level}
                onClick={() => setStep('language')}
                className="inline-flex w-full items-center justify-center rounded-lg bg-gold px-6 py-3.5 text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {t('next')}
              </button>
              <button
                type="button"
                onClick={finish}
                disabled={submitting}
                className="text-center text-sm font-semibold text-text-secondary transition-colors hover:text-ink disabled:opacity-60"
              >
                {t('skipOnboarding')}
              </button>
            </div>
          </div>
        )}

        {step === 'language' && (
          <div className="animate-step">
            <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              {t('step2Title')}
            </h1>
            <p className="mt-2 text-text-secondary">{t('step2Subtitle')}</p>

            <div
              role="radiogroup"
              className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {locales.map((locale) => {
                const selected = language === locale;
                return (
                  <label
                    key={locale}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-colors',
                      selected ? 'border-gold bg-ink/5' : 'border-ink/15 hover:border-ink/30',
                    )}
                  >
                    <span className="font-semibold text-ink">
                      {localeLabels[locale]}
                    </span>
                    <input
                      type="radio"
                      name="language"
                      value={locale}
                      checked={selected}
                      onChange={() => setLanguage(locale)}
                      className="sr-only"
                    />
                    {selected && (
                      <Check className="h-5 w-5 text-gold" aria-hidden="true" />
                    )}
                  </label>
                );
              })}

              {UPCOMING_LANGUAGES.map((name) => (
                <div
                  key={name}
                  aria-disabled="true"
                  className="flex items-center justify-between rounded-xl border-2 border-dashed border-ink/15 p-4 opacity-70"
                >
                  <span className="font-semibold text-text-secondary">{name}</span>
                  <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold text-text-secondary">
                    {t('comingSoon')}
                  </span>
                </div>
              ))}
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={finish}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {t('finish')}
              </button>
              <button
                type="button"
                onClick={finish}
                disabled={submitting}
                className="text-center text-sm font-semibold text-text-secondary transition-colors hover:text-ink disabled:opacity-60"
              >
                {t('skip')}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
