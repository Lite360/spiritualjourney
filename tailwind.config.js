/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#F8F6F0',
          text: '#171717',
        },
        secondary: {
          dark: '#344236',
          bg: '#E8E1D4',
        },
        accent: '#B89B5E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
