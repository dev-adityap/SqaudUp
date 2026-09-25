/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#08080a',
          800: '#0f0f13',
          700: '#18181f',
          600: '#23232c',
        },
        sports: {
          football: '#22c55e',   // Neon Pitch Green
          cricket: '#3b82f6',    // Electric Sky Blue
          basketball: '#ff5500', // Court Orange
          volleyball: '#a855f7', // Violet
          badminton: '#06b6d4',  // Neon Cyan
          tennis: '#eab308',     // Volt Yellow
        }
      }
    },
  },
  plugins: [],
}