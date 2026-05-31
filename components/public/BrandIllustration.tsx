/**
 * Abstract, brand-coloured SVG illustration evoking language and learning:
 * an open book, flowing text lines and overlapping speech bubbles. Pure SVG,
 * no external assets. Individual layers float gently (see globals.css).
 *
 * Shared between the marketing Hero and the authentication brand panel.
 */
export function BrandIllustration({
  label,
  className = 'h-full w-full',
}: {
  label: string;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 480 480"
      className={className}
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
