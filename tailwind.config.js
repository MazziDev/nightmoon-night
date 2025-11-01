/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ['"Dancing Script"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'night-sky': 'linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))',
      },
      boxShadow: {
        moon: '0 0 40px rgba(255,255,255,0.45)',
      },
      animation: {
        'gradient-move': 'gradientMove 14s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 6s ease-in-out infinite',
        'twinkle': 'twinkle 7s ease-in-out infinite',
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.9' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}
