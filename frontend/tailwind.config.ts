import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', '"Space Grotesk"', 'Inter', 'sans-serif'],
        body: ['var(--font-body)', '"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: '#0b1220',
        mint: '#22c55e',
        slateDeep: '#0f172a',
      },
    },
  },
  plugins: [],
};

export default config;
