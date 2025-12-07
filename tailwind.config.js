/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      fontFamily: {
        'sans': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        yellow: {
          400: '#DDFF30',
          300: '#E5FF4D',
        },
        'neon-yellow': '#DDFF30',
        'neon-yellow-dark': '#DDFF30',
        'dark-bg': '#171616',
        'light-text': '#F0EFEF',
      },
    },
  },
  plugins: [],
}

