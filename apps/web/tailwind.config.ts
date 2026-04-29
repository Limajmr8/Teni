import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bazar: {
          primary: '#1B4332',
          accent: '#F59E0B',
          background: '#FEFCE8',
          text: '#1C1917',
          surface: '#FFFFFF',
          border: '#E7E5E4',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-lora)'],
        mono: ['var(--font-inter-mono)'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
