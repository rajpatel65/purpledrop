/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF6EF',
        cream: '#F3ECDF',
        ink: {
          DEFAULT: '#1A1815',
          soft: '#5C564B',
          faint: '#8A8375',
        },
        violet: {
          DEFAULT: '#6D28D9',
          deep: '#5B21B6',
          tint: '#EDE9FE',
          '50': '#F5F0FF',
          '100': '#EDE9FE',
          '200': '#DCD6FD',
          '300': '#C4B5FA',
          '400': '#A88EF5',
          '500': '#8B61EF',
          '600': '#6D28D9',
          '700': '#5B21B6',
          '800': '#4C1DB2',
          '900': '#3E1A8F',
        },
        line: '#E7E0D2',
        gold: {
          DEFAULT: '#D4A843',
          light: '#F0E0B8',
          dark: '#B89038',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26,24,21,0.04), 0 6px 20px rgba(26,24,21,0.05)',
        lift: '0 2px 4px rgba(26,24,21,0.05), 0 16px 40px rgba(109,40,217,0.12)',
        card: '0 1px 3px rgba(26,24,21,0.06), 0 4px 12px rgba(26,24,21,0.04)',
        'card-hover': '0 8px 30px rgba(26,24,21,0.08), 0 4px 12px rgba(109,40,217,0.08)',
      },
      maxWidth: {
        page: '76rem',
        content: '64rem',
      },
      borderRadius: {
        'card': '1rem',
        'card-lg': '1.25rem',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
};