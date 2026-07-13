import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--ecl-bg)',
        recessed: 'var(--ecl-recessed)',
        primary: 'var(--ecl-primary)',
        'primary-tint': 'var(--ecl-primary-tint)',
        secondary: 'var(--ecl-secondary)',
        accent: 'var(--ecl-accent)',
        'accent-tint': 'var(--ecl-accent-tint)',
        ink: 'var(--ecl-text)',
        muted: 'var(--ecl-text-muted)',
        edge: 'var(--ecl-border)',
        complete: 'var(--ecl-complete)',
        action: 'var(--ecl-action)',
        problem: 'var(--ecl-problem)',
        future: 'var(--ecl-future)',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
