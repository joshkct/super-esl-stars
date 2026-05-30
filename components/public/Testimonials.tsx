import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';
import { Reveal } from './Reveal';

const ITEMS = ['one', 'two', 'three'] as const;

/** Derive avatar initials from a full name. */
function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Social proof grid. Three testimonial cards from learners at different
 * levels and countries, each with a star rating and a subtle hover lift.
 */
export async function Testimonials() {
  const t = await getTranslations('testimonials');

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-surface py-24"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className="font-serif text-4xl font-bold text-ink sm:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">{t('subtitle')}</p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ITEMS.map((item, index) => {
            const name = t(`items.${item}.name`);
            return (
              <li key={item}>
                <Reveal
                  as="figure"
                  delay={index * 100}
                  className="flex h-full flex-col rounded-2xl border border-ink/10 bg-cream p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ink font-semibold text-gold"
                    >
                      {initials(name)}
                    </span>
                    <figcaption>
                      <p className="font-semibold text-ink">{name}</p>
                      <p className="text-sm text-text-secondary">
                        <span aria-hidden="true">
                          {t(`items.${item}.flag`)}{' '}
                        </span>
                        {t(`items.${item}.country`)} ·{' '}
                        {t(`items.${item}.level`)}
                      </p>
                    </figcaption>
                  </div>

                  <div
                    className="mt-4 flex gap-0.5"
                    aria-label="Rated 5 out of 5"
                  >
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star
                        key={s}
                        className="h-4 w-4 fill-gold text-gold"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote className="mt-4 font-serif text-lg italic leading-relaxed text-ink">
                    &ldquo;{t(`items.${item}.quote`)}&rdquo;
                  </blockquote>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
