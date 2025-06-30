import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#337ab7',
      },
      backgroundImage: {
        'gradient-custom-blue-hover':
          'linear-gradient(to right, #007bff, #00c6ff)',
        'gradient-custom-blue':
          'linear-gradient(to right, #0a64a7 0%, #258dcf 51%, #1f85c7 100%)',
      },
      backgroundColor: {
        'custom-transparent': 'rgba(0,0,0,.5)',
      },
      borderImage: {
        'custom-border-image':
          'linear-gradient(to right, #39adf0 0%, #075fa3 100%);',
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
        // thêm các giá trị bạn cần
      },
    },
  },
  plugins: [scrollbar],
};
