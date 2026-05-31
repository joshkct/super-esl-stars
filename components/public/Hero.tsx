import { getTranslations } from 'next-intl/server';
import { CalendarClock, GraduationCap, Video } from 'lucide-react';
import { BrandIllustration } from './BrandIllustration';

export async function Hero() {
  const t = await getTranslations('hero');

  const badges = [
    { key: 'levels', label: t('badges.levels'), Icon: GraduationCap },
    { key: 'scheduling', label: t('badges.scheduling'), Icon: CalendarClock },
    { key: 'sessions', label: t('badges.sessions'), Icon: Video },
  ];

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center overflow-hidden bg-cream pt-20"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Left: content */}
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            {t('eyebrow')}
          </p>
          <h1
            id="hero-heading"
            className="mt-4 font-serif text-5xl font-bold leading-[1.05] text-ink sm:text-6xl"
          >
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md bg-gold px-7 py-3.5 text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              {t('ctaPrimary')}
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-md border-2 border-ink px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              {t('ctaSecondary')}
            </a>
          </div>

          {/* Trust signals */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {badges.map(({ key, label, Icon }) => (
              <li
                key={key}
                className="flex items-center gap-2 text-sm font-medium text-ink"
              >
                <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: illustration */}
        <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
          <BrandIllustration label={t('illustrationAlt')} />
        </div>
      </div>
    </section>
  );
}
