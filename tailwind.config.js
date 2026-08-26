/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        upnd: {
          red:      '#E30520',
          darkred:  '#8B0000',
          gold:     '#F5EA26',
          black:    '#0A0A0A',
          green:    '#39A333',
          charcoal: '#1A1A1A',
          offwhite: '#F5F0E8',
        },
      },
      fontFamily: {
        bebas:   ['Inter', 'sans-serif'],
        playfair: ['Inter', 'sans-serif'],
        dm:       ['Inter', 'sans-serif'],
      },
      animation: {
        ticker:     'ticker 35s linear infinite',
        fadeUp:     'fadeUp 0.7s ease forwards',
        scrollLine: 'scrollLine 1.8s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scrollLine: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
}
