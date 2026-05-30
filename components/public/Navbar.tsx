'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useScrollPosition } from '@/lib/hooks/useScrollPosition';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#how-it-works', key: 'howItWorks' },
  { href: '#about', key: 'about' },
  { href: '#pricing', key: 'pricing' },
  { href: '#testimonials', key: 'testimonials' },
  { href: '#contact', key: 'contact' },
] as const;

/** Verbjective wordmark with a gold underline accent. */
function Wordmark() {
  return (
    <span className="relative inline-block font-serif text-2xl font-bold tracking-tight text-ink">
      Verbjective
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-0.5 w-8 rounded-full bg-gold"
      />
    </span>
  );
}

/**
 * Sticky landing navbar. Transparent over the hero, then transitions to a
 * blurred white bar with a subtle shadow once the user scrolls past 80px.
 * Collapses into a full-width dropdown on mobile.
 */
export function Navbar() {
  const t = useTranslations('nav');
  const scrolled = useScrollPosition(80);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || mobileOpen
          ? 'bg-surface/90 shadow-[0_1px_20px_rgba(27,42,74,0.08)] backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8"
      >
        <Link href="/" aria-label="Verbjective home">
          <Wordmark />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink transition-colors hover:text-gold"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right cluster */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            href="/sign-in"
            className="rounded-md px-4 py-2 text-sm font-semibold text-ink transition-colors hover:text-gold"
          >
            {t('signIn')}
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            {t('getStarted')}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          className="inline-flex items-center justify-center rounded-md p-2 text-ink lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-ink/10 bg-surface px-6 pb-6 pt-2 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-base font-medium text-ink transition-colors hover:text-gold"
                >
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <LanguageSwitcher className="self-start" />
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-md border border-ink/20 px-4 py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
            >
              {t('signIn')}
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-md bg-gold px-4 py-2.5 text-center text-sm font-semibold text-ink shadow-sm"
            >
              {t('getStarted')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
