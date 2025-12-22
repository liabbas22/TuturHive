/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
       fontFamily: {
        merienda: ['Merienda', 'cursive'],
        outfit: ['Outfit', 'sans-serif'],
        playAUQLD: ['"Playwrite AU QLD"', 'sans-serif'],
        playDEGrund: ['"Playwrite DE Grund"', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeLeft: {
          '0%': { opacity: 0, transform: 'translateX(-30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeRight: {
          '0%': { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease-out both',
        fadeLeft: 'fadeLeft 0.8s ease-out both',
        fadeRight: 'fadeRight 0.8s ease-out both',
      },
    },
  },
  plugins: [],
};
