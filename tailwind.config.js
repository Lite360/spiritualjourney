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
          bg: '#FFFFFF', // Pure white background
          text: '#3E2723', // Dark brown text
          main: '#5D4037', // Medium mocha brown
        },
        secondary: {
          surface: '#EFEBE9', // Light brown/gray surface
          bg: '#F5F5F5', // Very light gray/white for subtle cards
          dark: '#3E2723', // Dark brown for footers/headers (same as primary text for consistency)
          accent: '#8D6E63', // Caramel brown accent
        },
        accent: '#795548', // Warm brown accent
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
