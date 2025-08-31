/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark green theme with correct background
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5', 
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Main bright green
          600: '#059669', // Darker green
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Custom dark green backgrounds with your exact color
        'dark-green': {
          900: '#10231d', // Your exact background color
          800: '#1a2e27', // Slightly lighter variation
          700: '#243831', // Medium dark green
          600: '#2e443b', // Lighter dark green
          500: '#385045', // Even lighter
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
