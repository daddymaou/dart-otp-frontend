import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        violet: 'var(--violet)',
        'violet-deep': 'var(--violet-deep)',
        lilac: 'var(--lilac)',
        pink: 'var(--pink)',
        yellow: 'var(--yellow)',
        sky: 'var(--sky)',
        mint: 'var(--mint)',
        orange: 'var(--orange)',
        steel: 'var(--steel)',
        danger: 'var(--danger)',
      },
      boxShadow: {
        hard: '6px 6px 0 rgba(23,20,31,1)',
        'hard-sm': '3px 3px 0 rgba(23,20,31,1)',
        'hard-lg': '10px 10px 0 rgba(23,20,31,1)',
      },
      fontFamily: {
        display: ['var(--font-bricolage)', 'sans-serif'],
        body: ['var(--font-dmsans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        sm: '12px',
        md: '20px',
        lg: '32px',
      },
    },
  },
  plugins: [],
};

export default config;
