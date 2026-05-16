/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        purple: {
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
        }
      }
    },
  },
  plugins: [],
}
