'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const DURATION_MS = 8000;
const TICK_MS = 50;

/** Gold checkmark with a draw-on animation (see `.animate-draw`). */
function AnimatedCheck() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-20 w-20"
      role="img"
      aria-hidden="true"
    >
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="4"
        pathLength={1}
        className="animate-draw"
      />
      <path
        d="M25 41 L36 52 L56 30"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="animate-draw"
        style={{ animationDelay: '0.45s' }}
      />
    </svg>
  );
}

/**
 * Welcome confirmation screen. Greets the user by name (when available),
 * offers next-step CTAs and auto-redirects to the student dashboard after
 * 8 seconds. Hovering or focusing either CTA pauses the countdown.
 */
export function WelcomeScreen({ firstName }: { firstName: string | null }) {
  const t = useTranslations('auth.welcome');
  const router = useRouter();
  const [progress, setProgress] = useState(100);
  const pausedRef = useRef(false);
  const remainingRef = useRef(DURATION_MS);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      remainingRef.current -= TICK_MS;
      setProgress(Math.max(0, (remainingRef.current / DURATION_MS) * 100));
      if (remainingRef.current <= 0) {
        clearInterval(id);
        router.replace('/dashboard/student');
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [router]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-16 text-center">
      <AnimatedCheck />

      <h1 className="mt-8 max-w-2xl font-serif text-4xl font-bold text-ink sm:text-5xl">
        {firstName ? t('titleNamed', { name: firstName }) : t('title')}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-text-secondary">{t('subtitle')}</p>

      <div
        className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
      >
        <Link
          href="/dashboard/student"
          className="inline-flex items-center justify-center rounded-lg bg-gold px-7 py-3.5 text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
        >
          {t('bookCta')}
        </Link>
        {!firstName && (
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-lg border-2 border-ink px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            {t('completeProfileCta')}
          </Link>
        )}
      </div>

      {/* Countdown progress */}
      <div className="mt-10 w-full max-w-xs">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label={t('redirecting')}
        >
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-text-secondary">{t('redirecting')}</p>
      </div>
    </main>
  );
}
