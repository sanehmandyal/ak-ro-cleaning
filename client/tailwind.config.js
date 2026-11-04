/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep Abyssal Midnight Navy with Twilight sheen
        navy: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38aaf7',
          500: '#0e8ee8',
          600: '#0270c5',
          700: '#03589f',
          800: '#07325c',
          900: '#06203d',
          950: '#031022',
        },
        // Electric Cyan-Teal Ocean brand
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Vivid Radiant Aqua & Electric Cyan
        aqua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Pure Crystal Mint / Emerald for Purity & Eco Standards
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px -2px rgba(6, 182, 212, 0.08), 0 10px 25px -5px rgba(3, 16, 34, 0.08)',
        glow: '0 10px 30px -8px rgba(6, 182, 212, 0.5), 0 4px 15px rgba(20, 184, 166, 0.35)',
        'glow-teal': '0 10px 30px -8px rgba(20, 184, 166, 0.5)',
        'glow-emerald': '0 10px 30px -8px rgba(34, 197, 94, 0.45)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseSlow: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
      },
      animation: {
        'fade-up': 'fade-up .5s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
