/**
 * Central internationalisation configuration.
 *
 * Verbjective ships English-only on day one but is structured so additional
 * locales can be added by (1) appending the locale code here and (2) creating
 * a matching translation file in `/messages`.
 */
export const locales = ['en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Cookie used to persist the visitor's selected locale across requests. */
export const LOCALE_COOKIE = 'VERBJECTIVE_LOCALE';

/** Human-readable labels for the language switcher in the navigation. */
export const localeLabels: Record<Locale, string> = {
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
