import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Verbjective academic brand palette. Every value maps to a CSS custom
        // property declared in globals.css so colours stay centralised.
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-text-secondary)',
        },
        gold: {
          DEFAULT: 'var(--color-gold)',
        },
        cream: 'var(--color-cream)',
        surface: 'var(--color-surface)',
        success: 'var(--color-success)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        // Legacy academic blue scale retained for existing dashboard/auth pages.
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#598dff',
          500: '#3563eb',
          600: '#1f44c8',
          700: '#1a37a1',
          800: '#1b3185',
          900: '#1c2f6c',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
