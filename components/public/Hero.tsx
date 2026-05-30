import { getTranslations } from 'next-intl/server';
import { CalendarClock, GraduationCap, Video } from 'lucide-react';

/**
 * Abstract, brand-coloured SVG illustration evoking language and learning:
 * an open book, flowing text lines and overlapping speech bubbles. Pure SVG,
 * no external assets. Individual layers float gently (see globals.css).
 */
function HeroIllustration({ label }: { label: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 480 480"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="verb-ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22345a" />
          <stop offset="100%" stopColor="#1b2a4a" />
        </linearGradient>
        <linearGradient id="verb-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d8bb63" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>

      {/* Soft background discs */}
      <circle cx="240" cy="240" r="200" fill="#fff" opacity="0.6" />
      <circle cx="240" cy="240" r="150" fill="#f1ece0" />

      {/* Open book */}
      <g className="animate-float">
        <path
          d="M120 300 C170 270 220 270 240 286 C260 270 310 270 360 300 L360 200 C310 172 260 172 240 188 C220 172 170 172 120 200 Z"
          fill="url(#verb-ink)"
        />
        <path
          d="M240 188 L240 286"
          stroke="#c9a84c"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Text lines, left page */}
        <g stroke="#f8f6f1" strokeWidth="4" strokeLinecap="round" opacity="0.7">
          <line x1="150" y1="212" x2="220" y2="208" />
          <line x1="150" y1="230" x2="220" y2="226" />
          <line x1="150" y1="248" x2="205" y2="245" />
        </g>
        {/* Text lines, right page */}
        <g stroke="#f8f6f1" strokeWidth="4" strokeLinecap="round" opacity="0.7">
          <line x1="260" y1="208" x2="330" y2="212" />
          <line x1="260" y1="226" x2="330" y2="230" />
          <line x1="260" y1="245" x2="315" y2="248" />
        </g>
      </g>

      {/* Speech bubble — gold */}
      <g className="animate-float-slow">
        <path
          d="M300 110 h84 a18 18 0 0 1 18 18 v44 a18 18 0 0 1 -18 18 h-30 l-16 20 l-4 -20 h-34 a18 18 0 0 1 -18 -18 v-44 a18 18 0 0 1 18 -18 Z"
          fill="url(#verb-gold)"
        />
        <text
          x="342"
          y="160"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="40"
          fontWeight="700"
          fill="#1b2a4a"
        >
          Aa
        </text>
      </g>

      {/* Speech bubble — ink */}
      <g className="animate-float">
        <path
          d="M96 150 h70 a16 16 0 0 1 16 16 v36 a16 16 0 0 1 -16 16 h-24 l-14 18 l-3 -18 h-29 a16 16 0 0 1 -16 -16 v-36 a16 16 0 0 1 16 -16 Z"
          fill="url(#verb-ink)"
        />
        <g fill="#c9a84c">
          <circle cx="116" cy="184" r="5" />
          <circle cx="138" cy="184" r="5" />
          <circle cx="160" cy="184" r="5" />
        </g>
      </g>

      {/* Floating letterforms */}
      <text
        className="animate-float-slow"
        x="360"
        y="330"
        fontFamily="Georgia, serif"
        fontSize="56"
        fontWeight="700"
        fill="#1b2a4a"
        opacity="0.85"
      >
        B
      </text>
      <text
        className="animate-float"
        x="110"
        y="360"
        fontFamily="Georgia, serif"
        fontSize="44"
        fontWeight="700"
        fill="#c9a84c"
      >
        e
      </text>
    </svg>
  );
}

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
          <HeroIllustration label={t('illustrationAlt')} />
        </div>
      </div>
    </section>
  );
}
