'use client';

import { useState, useId } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = ['booking', 'cancel', 'difference', 'level', 'join'] as const;

/**
 * Single-open accordion. Smooth open/close via a CSS max-height transition
 * (no animation library). Fully keyboard accessible with correct ARIA wiring.
 */
export function FAQ() {
  const t = useTranslations('faq');
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-cream py-24"
    >
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="faq-heading"
            className="font-serif text-4xl font-bold text-ink sm:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">{t('subtitle')}</p>
        </div>

        <dl className="mt-12 space-y-4">
          {ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const btnId = `${baseId}-q-${index}`;
            const panelId = `${baseId}-a-${index}`;
            return (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-ink/10 bg-surface"
              >
                <dt>
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="font-serif text-lg font-semibold text-ink">
                      {t(`items.${item}.question`)}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 flex-none text-gold transition-transform duration-300',
                        isOpen && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </dt>
                <dd
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={cn(
                    'grid transition-all duration-300 ease-out',
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-text-secondary">
                      {t(`items.${item}.answer`)}
                    </p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
