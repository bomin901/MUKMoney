/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          orange: '#FDBA74',
          yellow: '#FDE047',
          pink: '#F9A8D4',
          green: '#86EFAC',
          blue: '#93C5FD'
        }
      }
    },
  },
  plugins: [],
}
