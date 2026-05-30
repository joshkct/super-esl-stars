'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { formatZar } from '@/lib/pricing';
import type { EnglishLevel, SessionDuration } from '@/types';
import { cn } from '@/lib/utils';

export interface PricingLevelData {
  level: EnglishLevel;
  durations: { minutes: SessionDuration; priceCents: number }[];
  monthlyFromCents: number;
  sessionsPerMonth: number | null;
  savePct: number;
}

type Mode = 'session' | 'subscribe';

/**
 * Interactive pricing block: a sliding toggle switches between pay-per-session
 * pricing tables and a subscription view. All display strings come from
 * next-intl; prices are passed in as ZAR cents and formatted client-side.
 */
export function PricingClient({ levels }: { levels: PricingLevelData[] }) {
  const t = useTranslations('pricing');
  const [mode, setMode] = useState<Mode>('session');

  return (
    <div>
      {/* Toggle */}
      <div className="mt-10 flex justify-center">
        <div
          role="tablist"
          aria-label={t('title')}
          className="relative inline-flex rounded-full bg-ink/5 p-1"
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-surface shadow-sm transition-transform duration-300 ease-out',
              mode === 'subscribe' && 'translate-x-[calc(100%+0.5rem)]',
            )}
          />
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'session'}
            onClick={() => setMode('session')}
            className={cn(
              'relative z-10 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors',
              mode === 'session' ? 'text-ink' : 'text-text-secondary',
            )}
          >
            {t('toggle.payPerSession')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'subscribe'}
            onClick={() => setMode('subscribe')}
            className={cn(
              'relative z-10 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors',
              mode === 'subscribe' ? 'text-ink' : 'text-text-secondary',
            )}
          >
            {t('toggle.subscribe')}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {levels.map((data) => {
          const isPopular = data.level === 'intermediate';
          return (
            <div
              key={data.level}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-surface p-7 transition-shadow',
                isPopular
                  ? 'border-gold shadow-lg md:-translate-y-2'
                  : 'border-ink/10 shadow-sm hover:shadow-md',
              )}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold uppercase tracking-wide text-ink shadow-sm">
                  {t('mostPopular')}
                </span>
              )}

              <h3 className="font-serif text-2xl font-bold text-ink">
                {t(`levels.${data.level}.name`)}
              </h3>
              <p className="mt-2 min-h-[3rem] text-sm text-text-secondary">
                {t(`levels.${data.level}.description`)}
              </p>

              {mode === 'session' ? (
                <table className="mt-6 w-full border-collapse text-sm">
                  <tbody>
                    {data.durations.map(({ minutes, priceCents }) => (
                      <tr
                        key={minutes}
                        className="border-t border-ink/10 first:border-t-0"
                      >
                        <td className="py-3 font-medium text-ink">
                          {t(`duration.${minutes}`)}
                        </td>
                        <td className="py-3 text-right font-semibold text-ink">
                          {formatZar(priceCents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="mt-6 flex-1">
                  <p className="font-serif text-3xl font-bold text-ink">
                    {t('perMonthFrom', {
                      price: formatZar(data.monthlyFromCents),
                    })}
                  </p>
                  {data.sessionsPerMonth !== null && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                      <Check
                        className="h-4 w-4 text-success"
                        aria-hidden="true"
                      />
                      {t('sessionsPerMonth', {
                        count: data.sessionsPerMonth,
                      })}
                    </p>
                  )}
                  <span className="mt-4 inline-block rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                    {t('saveBadge', { percent: data.savePct })}
                  </span>
                </div>
              )}

              <a
                href="/sign-up"
                className={cn(
                  'mt-7 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5',
                  isPopular
                    ? 'bg-gold text-ink shadow-sm hover:shadow-md'
                    : 'border-2 border-ink text-ink hover:bg-ink hover:text-cream',
                )}
              >
                {mode === 'session' ? t('bookCta') : t('subscribeCta')}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
