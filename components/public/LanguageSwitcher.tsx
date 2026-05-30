'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { locales, localeLabels, type Locale } from '@/i18n/config';
import { setUserLocale } from '@/i18n/locale';
import { cn } from '@/lib/utils';

/**
 * Cookie-based language switcher. Persists the chosen locale via a server
 * action and refreshes the route so server components re-render with the new
 * messages. Built as a keyboard-accessible dropdown; ready for additional
 * locales as they are added to the i18n config.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('nav');
  const activeLocale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function onSelect(locale: Locale) {
    setOpen(false);
    startTransition(async () => {
      await setUserLocale(locale);
      router.refresh();
    });
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('selectLanguage')}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-ink transition-colors hover:text-gold"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="uppercase">{activeLocale}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('selectLanguage')}
          className="absolute right-0 z-50 mt-2 min-w-[10rem] overflow-hidden rounded-lg border border-ink/10 bg-surface py-1 shadow-lg"
        >
          {locales.map((locale) => {
            const isActive = locale === activeLocale;
            return (
              <li key={locale}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => onSelect(locale)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-sm text-ink transition-colors hover:bg-cream',
                    isActive && 'font-semibold',
                  )}
                >
                  {localeLabels[locale]}
                  {isActive && (
                    <Check className="h-4 w-4 text-gold" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
