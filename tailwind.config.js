import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#0a4d9c',
      },
      backgroundImage: {
        'gradient-custom-blue-hover':
          'linear-gradient(to right, #0a4d9c, #1f7bd9)',
        'gradient-custom-blue':
          'linear-gradient(to right, #083d7c 0%, #0a4d9c 51%, #1f6dbf 100%)',
      },
      backgroundColor: {
        'custom-transparent': 'rgba(0,0,0,.5)',
      },
      borderImage: {
        'custom-border-image':
          'linear-gradient(to right, #1f7bd9 0%, #0a4d9c 100%);',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animationDelay: {
        2000: '2000ms',
        3000: '3000ms',
      },
    },
  },
  plugins: [scrollbar],
};
