module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'dark',
  theme: {
    screens: {
      xxxxxl: { max: '1999.98px' },
      xxxxl: { max: '1799.98px' },
      xxxl: { max: '1599.98px' },
      xxl: { max: '1499.98px' },
      xl: { max: '1399.98px' },
      lg: { max: '1199.98px' },
      md: { max: '991.98px' },
      sm: { max: '767.98px' },
      xs: { max: '575.98px' },
    },
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        fadeInForward: 'fadeInForward 0.5s ease',
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        fadeInForward: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shake: {
          '0%': {
            transform: 'translate(0)',
          },
          '25%': {
            transform: 'translate(-8px)',
          },
          '50%': {
            transform: 'translate(8px)',
          },
          '75%': {
            transform: 'translate(-8px)',
          },
          '100%': {
            transform: 'translate(0)',
          },
        },
      },
      boxShadow: {
        filterBox: '0 -4px 32px #0003',
        subjectCard: '0 4px 8px #0000001a',
      },
      colors: {
        primary: {
          DEFAULT: '#f05123',
          50: '#fef1ec',
          100: '#fde0d8',
          200: '#fbb8a8',
          300: '#f98e76',
          400: '#f66a4d',
          500: '#f05123',
          600: '#e0481f',
          700: '#c8401b',
          800: '#a83718',
          900: '#8a2f14',
          950: '#5c1f0d',
        },
        secondary: {
          DEFAULT: '#0093fc',
          50: '#e8f5ff',
          100: '#cceaff',
          200: '#99d5ff',
          300: '#66c0ff',
          400: '#33abff',
          500: '#0093fc',
          600: '#0084e3',
          700: '#0073c2',
          800: '#0061a1',
          900: '#004d80',
          950: '#002f4d',
        },
        textBlack: '#3A4252',
      },
    },
  },
  plugins: [{ autoprefixer: {} }],
};
