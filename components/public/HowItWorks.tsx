import { getTranslations } from 'next-intl/server';
import { Reveal } from './Reveal';

const STEPS = ['signUp', 'choose', 'book', 'join'] as const;

/**
 * Vertical timeline explaining the four-step journey. On desktop the steps
 * align along a central connecting line; on mobile they stack. Each step
 * fades in from below as it enters the viewport via the Reveal wrapper.
 */
export async function HowItWorks() {
  const t = await getTranslations('howItWorks');

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-cream py-24"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="how-it-works-heading"
            className="font-serif text-4xl font-bold text-ink sm:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">{t('subtitle')}</p>
        </Reveal>

        <ol className="relative mt-16 space-y-12">
          {/* Connecting line */}
          <span
            aria-hidden="true"
            className="absolute left-[27px] top-2 bottom-2 w-px bg-gold/30 md:left-1/2 md:-translate-x-1/2"
          />

          {STEPS.map((step, index) => (
            <li key={step} className="relative">
              <Reveal
                as="div"
                delay={index * 100}
                className="flex items-start gap-6 md:grid md:grid-cols-2 md:items-center md:gap-12"
              >
                {/* Number marker */}
                <div
                  className={
                    index % 2 === 0
                      ? 'md:col-start-1 md:row-start-1 md:text-right'
                      : 'md:col-start-2 md:row-start-1'
                  }
                >
                  <div className="flex items-start gap-4 md:block">
                    <span className="relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-full bg-ink font-serif text-2xl font-bold text-gold shadow-md md:ml-auto md:mr-0 md:inline-flex">
                      {index + 1}
                    </span>
                    <div className="md:mt-4">
                      <h3 className="font-serif text-2xl font-bold text-ink">
                        {t(`steps.${step}.title`)}
                      </h3>
                      <p className="mt-2 max-w-sm text-text-secondary md:max-w-none">
                        {t(`steps.${step}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
