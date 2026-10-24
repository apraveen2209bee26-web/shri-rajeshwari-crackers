/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ember: {
          50: '#fff1ef',
          100: '#ffd8d2',
          200: '#ffb2a5',
          300: '#ff8a77',
          400: '#ff6248',
          500: '#ff3a20',
          600: '#e12610',
          700: '#b91c0d',
          800: '#8f170e',
          900: '#68140f',
        },
        coal: {
          900: '#21160f',
          800: '#3b291d',
          700: '#5a4636',
          600: '#796351',
        },
        cream: '#fff8ef',
        gold: {
          50: '#fff9de',
          100: '#fff0b8',
          200: '#ffe287',
          300: '#ffd056',
          400: '#f6bc2f',
          500: '#e8a814',
          600: '#c7860d',
          700: '#9f650d',
        },
      },
      boxShadow: {
        glow: '0 22px 48px rgba(225, 38, 16, 0.2)',
        festive: '0 18px 50px rgba(60, 33, 11, 0.1)',
      },
      fontFamily: {
        display: ['"Raleway"', 'sans-serif'],
        body: ['"Open Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at top left, rgba(255, 94, 64, 0.2), transparent 32%), radial-gradient(circle at 88% 14%, rgba(255, 208, 86, 0.3), transparent 28%), linear-gradient(135deg, #fff9ef 0%, #fff0d3 100%)',
        'festive-paper':
          'radial-gradient(circle at top left, rgba(255, 83, 48, 0.08), transparent 24%), radial-gradient(circle at top right, rgba(255, 208, 86, 0.12), transparent 20%), linear-gradient(180deg, #fffaf3 0%, #fff6e8 100%)',
      },
    },
  },
  plugins: [],
};
