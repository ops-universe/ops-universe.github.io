import type { Config } from 'tailwindcss';

// Colors are CSS variables (RGB channels) defined in src/styles/globals.css,
// so one token set drives every palette (aurora, graphite, forest) in light and dark.
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
        primary: token('primary'),
        'primary-ink': token('primary-ink'),
        'glow-1': token('glow-1'),
        'glow-2': token('glow-2'),
        'glow-3': token('glow-3'),
        signal: token('signal'),
        warn: token('warn'),
        danger: token('danger'),
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.6rem, 7vw, 5.75rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.1rem, 4.6vw, 3.75rem)', { lineHeight: '1.04', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.6rem, 3vw, 2.25rem)', { lineHeight: '1.12', letterSpacing: '-0.025em' }],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--accent) / 0.35), 0 10px 40px -10px rgb(var(--accent) / 0.35)',
        card: '0 1px 0 0 rgb(var(--ink) / 0.04) inset, 0 20px 50px -30px rgb(var(--glow-1) / 0.35)',
        float: '0 1px 0 0 rgb(255 255 255 / 0.25) inset, 0 18px 50px -18px rgb(var(--glow-1) / 0.45), 0 4px 14px -6px rgb(var(--ink) / 0.12)',
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
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        morph: {
          '0%, 100%': { borderRadius: '42% 58% 55% 45% / 48% 42% 58% 52%', transform: 'rotate(0deg) scale(1)' },
          '33%': { borderRadius: '58% 42% 46% 54% / 40% 58% 42% 60%', transform: 'rotate(60deg) scale(1.04)' },
          '66%': { borderRadius: '48% 52% 62% 38% / 56% 46% 54% 44%', transform: 'rotate(-40deg) scale(0.97)' },
        },
        'dash-flow': { to: { strokeDashoffset: '-24' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        blink: 'blink 1.1s steps(1) infinite',
        'grid-pan': 'grid-pan 8s linear infinite',
        'pulse-ring': 'pulse_ring 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        'spin-slow': 'spin-slow 22s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'dash-flow': 'dash-flow 1.2s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
