/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 10px 40px rgba(2, 6, 23, 0.2)'
      },
      colors: {
        brand: {
          500: '#0ea5a4',
          600: '#0d9488'
        }
      }
    }
  },
  plugins: []
};
