/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
        sans: ['"Space Grotesk"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        slughouse: {
          black: '#000000',
          dark: '#0A0A0A',
          card: '#121212',
          border: '#222222',
          gray: '#666666',
          lightgray: '#A1A1A1',
          white: '#FFFFFF',
        },
        editorial: {
          bg: '#F5F2EB',
          card: '#EDEAE1',
          ink: '#0C0C0C',
          muted: '#6E6B65',
          accent: '#FF3B00',
          border: '#D9D5CC',
        },
        electric: {
          lime: '#D4FF00',
          orange: '#FF4500',
          cyan: '#00F0FF',
          bg: '#08080C',
        },
      },
      letterSpacing: {
        tighter: '-0.06em',
        tightest: '-0.08em',
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}
