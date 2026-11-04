/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#f1f5fb', 100: '#dde7f5', 600: '#16345f', 700: '#10294d', 800: '#0b1f3a', 900: '#071528' },
        brand: { 50: '#eef6ff', 100: '#d9eaff', 500: '#2a7de1', 600: '#1d6fe0', 700: '#1559b8' },
        aqua: { 50: '#e8fbfd', 100: '#c8f4f8', 400: '#2dd4e6', 500: '#19c3d6', 600: '#0ea5b7' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,58,.04), 0 8px 24px -8px rgba(11,31,58,.12)',
        glow: '0 10px 30px -10px rgba(29,111,224,.55)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: { 'fade-up': 'fade-up .5s ease-out both', float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
