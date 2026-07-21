/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#07131d',
        ink: '#0d1726',
        accent: '#4cc9f0',
        success: '#26c281',
        warning: '#f8c63f',
      },
    },
  },
  plugins: [],
};
