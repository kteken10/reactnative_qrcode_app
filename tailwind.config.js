const colors = require('./src/components/ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
      colors: {
        ...colors,
        // Direction 2 — Dark Glassmorphism palette
        d2: {
          bg: '#090D12',
          surface: '#0F141C',
          card: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.08)',
          amber: '#FF8933',
          'amber-light': '#FFB46D',
          teal: '#00D2B3',
          violet: '#8B5CF6',
          rose: '#F43F5E',
          'text-primary': '#FFFFFF',
          'text-secondary': '#B8C0D2',
          'text-muted': '#8F98AB',
          'text-dim': '#AAB3C3',
        },
      },
    },
  },
  plugins: [],
};
