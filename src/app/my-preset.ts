import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
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
  },
  components: {
    button: {
      root: {
        fontSize: '14px',
        sm: {
          fontSize: '14px',
          paddingX: '20px',
        },
      },
      colorScheme: {
        light: {
          text: {
            primary: {
              hoverBackground: 'transparent',
              activeBackground: 'transparent',
              color: '#000',
            },
          },
        },
      },
    },
  },
});
