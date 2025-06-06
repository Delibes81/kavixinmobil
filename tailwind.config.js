/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0fa',
          100: '#cce0f5',
          200: '#99c2eb',
          300: '#66a3e0',
          400: '#3385d6',
          500: '#0066cc',
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001429',
        },
        secondary: {
          50: '#fcf7e6',
          100: '#f9efcc',
          200: '#f3df99',
          300: '#edd066',
          400: '#e6c033',
          500: '#e6b325',
          600: '#b8901e',
          700: '#8a6c16',
          800: '#5c480f',
          900: '#2e2407',
        },
        neutral: {
          50: '#f5f7fa',
          100: '#ebeef5',
          200: '#d8deeb',
          300: '#c4cde0',
          400: '#b1bdd6',
          500: '#9daccc',
          600: '#7e8aa3',
          700: '#5e677a',
          800: '#3f4552',
          900: '#1f2229',
        },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};