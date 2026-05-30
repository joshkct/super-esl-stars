import { getTranslations } from 'next-intl/server';
import { Reveal } from './Reveal';

const CREDENTIALS = ['tefl', 'experience', 'students'] as const;

/**
 * "About the tutor" section. Split layout with a styled avatar placeholder on
 * the left and a warm, mentor-toned bio, credential pills and a philosophy
 * quote on the right.
 */
export async function AboutTutor() {
  const t = await getTranslations('about');

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-surface py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left: photo placeholder */}
        <Reveal className="flex justify-center lg:justify-start">
          <div className="w-full max-w-sm">
            <div
              role="img"
              aria-label={t('photoPlaceholder')}
              className="flex aspect-[4/5] items-center justify-center rounded-2xl border-2 border-dashed border-gold/50 bg-ink"
            >
              <span className="font-serif text-7xl font-bold text-gold">
                VB
              </span>
            </div>
            <p className="mt-3 text-center text-xs uppercase tracking-widest text-text-secondary">
              {t('photoPlaceholder')}
            </p>
          </div>
        </Reveal>

        {/* Right: content */}
        <Reveal delay={100}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            {t('label')}
          </p>
          <h2
            id="about-heading"
            className="mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl"
          >
            {t('title')}
          </h2>

          <div className="mt-6 space-y-4 text-text-secondary">
            <p>{t('bio1')}</p>
            <p>{t('bio2')}</p>
            <p>{t('bio3')}</p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {CREDENTIALS.map((c) => (
              <li
                key={c}
                className="rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-ink ring-1 ring-inset ring-gold/40"
              >
                {t(`credentials.${c}`)}
              </li>
            ))}
          </ul>

          <blockquote className="mt-8 border-l-4 border-gold pl-5">
            <p className="font-serif text-xl italic leading-relaxed text-ink">
              &ldquo;{t('quote')}&rdquo;
            </p>
            <cite className="mt-2 block text-sm font-medium not-italic text-text-secondary">
              — {t('quoteAuthor')}
            </cite>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
