/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        'grade-a': { bg: '#EAF3DE', text: '#27500A', bar: '#3B6D11' },
        'grade-b': { bg: '#C0DD97', text: '#27500A', bar: '#639922' },
        'grade-c': { bg: '#FAEEDA', text: '#633806', bar: '#BA7517' },
        'grade-d': { bg: '#FAC775', text: '#633806', bar: '#EF9F27' },
        'grade-e': { bg: '#FCEBEB', text: '#A32D2D', bar: '#E24B4A' },
        'grade-f': { bg: '#F7C1C1', text: '#791F1F', bar: '#A32D2D' },
        green: {
          primary: '#3B6D11',
          dark: '#27500A',
          light: '#EAF3DE',
        },
      },
      keyframes: {
        'grade-pop': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bar-fill': {
          from: { width: '0%' },
          to: { width: 'var(--target-width)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'grade-pop': 'grade-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bar-fill': 'bar-fill 800ms ease-out forwards',
        'fade-up': 'fade-up 400ms ease-out forwards',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
