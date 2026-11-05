/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: {
          50: '#faf7f4',
          100: '#f1ebe4',
          200: '#e0d4c7',
          300: '#c7b4a1',
          400: '#a48c78',
          500: '#86705e',
          600: '#6b5749',
          700: '#53443a',
          800: '#3a2e27',
          900: '#251c17',
        },
        sage: {
          50: '#f3f7f2',
          100: '#e3ece1',
          200: '#c5d8c2',
          300: '#9ebd9a',
          500: '#56805a',
          700: '#3d5e41',
          900: '#1f321f',
        },
        saffron: {
          50: '#fff9ea',
          100: '#fdf0c9',
          200: '#fbdd8c',
          300: '#f8c754',
          500: '#eaa21c',
          700: '#a8650f',
          900: '#5e3a0b',
        },
        leaf: {
          50: '#edf9f1',
          100: '#d3f0de',
          200: '#a8e0bb',
          300: '#6cc592',
          500: '#2e8b57',
          700: '#1f6b41',
          900: '#123f27',
        },
        ochre: {
          50: '#fff7ed',
          100: '#ffe9cc',
          200: '#fed7a1',
          300: '#fdb865',
          500: '#d9822b',
          700: '#9a5414',
          900: '#5c3209',
        },
        paprika: {
          50: '#fdf2f0',
          100: '#fbdfd9',
          200: '#f7c0b5',
          300: '#ef8f7c',
          500: '#c8462f',
          700: '#9b2d1b',
          900: '#5a1a10',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out both',
      },
    },
  },
  plugins: [],
};
