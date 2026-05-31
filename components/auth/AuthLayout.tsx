import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BrandIllustration } from '@/components/public/BrandIllustration';

/**
 * Shared split-screen shell for all authentication pages.
 *
 * Desktop: fixed ink-blue brand panel (45%) on the left with the wordmark,
 * tagline, the floating brand illustration and social-proof stats; white form
 * panel (55%) on the right. Mobile: brand panel is hidden and the form panel
 * fills the screen with an ink wordmark at the top.
 *
 * Rendered as a Server Component so translations are resolved on the server;
 * the interactive form is passed in as `children` (a Client Component).
 */
export async function AuthLayout({ children }: { children: React.ReactNode }) {
  const tHero = await getTranslations('hero');
  const tStats = await getTranslations('auth.brand.stats');

  const stats = [tStats('levels'), tStats('sessions'), tStats('scheduling')];

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left: brand panel (desktop only) */}
      <aside className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-ink px-12 py-14 lg:flex">
        <Link
          href="/"
          className="font-serif text-3xl font-bold text-gold"
          aria-label="Verbjective home"
        >
          Verbjective
        </Link>

        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-xs">
            <BrandIllustration label={tHero('illustrationAlt')} />
          </div>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/80">
            {tHero('subtitle')}
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {stats.map((stat) => (
            <li key={stat} className="flex items-center gap-3 text-sm text-white">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 flex-none rounded-full bg-gold"
              />
              {stat}
            </li>
          ))}
        </ul>
      </aside>

      {/* Right: form panel */}
      <main className="flex w-full flex-col lg:w-[55%]">
        {/* Mobile wordmark */}
        <div className="px-6 pt-8 lg:hidden">
          <Link
            href="/"
            className="font-serif text-2xl font-bold text-ink"
            aria-label="Verbjective home"
          >
            Verbjective
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
