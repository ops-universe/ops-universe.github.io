import type { Config } from 'tailwindcss';

// Colors are CSS variables (RGB channels) defined in src/styles/globals.css,
// so one token set drives both the dark (default) and light themes.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        elevated: token('elevated'),
        line: token('line'),
        ink: token('ink'),
        muted: token('muted'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
        signal: token('signal'),
        warn: token('warn'),
        danger: token('danger'),
      },
      fontFamily: {
        sans: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.6rem, 7vw, 5.75rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.1rem, 4.6vw, 3.75rem)', { lineHeight: '1.04', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.6rem, 3vw, 2.25rem)', { lineHeight: '1.12', letterSpacing: '-0.025em' }],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--accent) / 0.35), 0 10px 40px -10px rgb(var(--accent) / 0.35)',
        card: '0 1px 0 0 rgb(var(--ink) / 0.04) inset, 0 20px 50px -30px rgb(0 0 0 / 0.6)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        'grid-pan': { from: { backgroundPosition: '0 0' }, to: { backgroundPosition: '48px 48px' } },
        pulse_ring: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        blink: 'blink 1.1s steps(1) infinite',
        'grid-pan': 'grid-pan 8s linear infinite',
        'pulse-ring': 'pulse_ring 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
