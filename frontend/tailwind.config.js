/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d9488',
        accent: '#f59e0b'
      }
    }
  },
  plugins: []
}
