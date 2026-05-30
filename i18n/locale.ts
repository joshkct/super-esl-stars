'use server';

import { cookies } from 'next/headers';
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './config';

/** Read the active locale on the server (defaults to English). */
export async function getUserLocale(): Promise<Locale> {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : defaultLocale;
}

/** Persist the chosen locale to a cookie. Invoked by the language switcher. */
export async function setUserLocale(locale: Locale): Promise<void> {
  cookies().set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}
