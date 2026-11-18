import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        display: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f95700',
          600: '#e04800',
          700: '#c23800',
          800: '#9a2e00',
          900: '#7a2500',
        },
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf6',
          200: '#c5d9ed',
          500: '#1b4d7e',
          700: '#0f355c',
          800: '#0c2a49',
          900: '#07213a',
          950: '#041424',
        },
      },
    },
  },
  plugins: [],
};

export default config;
