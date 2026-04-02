/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          400: '#FB923C',
          500: '#E87722',
          600: '#C2621A',
          700: '#9A4E15',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#1A6B3A',
          600: '#166534',
          700: '#14532D',
        },
        ivory: '#FAF8F3',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Tiro Devanagari Hindi', 'serif'],
      },
    },
  },
  plugins: [],
};
