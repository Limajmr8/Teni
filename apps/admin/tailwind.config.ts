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
    },
  },
  plugins: [],
};

export default config;
