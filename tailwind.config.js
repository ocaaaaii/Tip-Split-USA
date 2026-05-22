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
        // Maillard Palette — #688DA5 steel-blue · #3D1D0A espresso · #D4B880 nude-beige
        cream: {
          bg:     '#EDE0C0',
          card:   '#F7EED8',
          border: '#D4B880',
          deep:   '#E5D0A0',
        },
        mocha: {
          dark:  '#3D1D0A',
          mid:   '#6B3A20',
          light: '#A07858',
          pale:  '#D4B880',
        },
        accent: {
          warm:      '#688DA5',
          warmHover: '#5A7A92',
          sage:      '#7A9E7E',
          sky:       '#8BAFC4',
          orange:    '#C4581A',
          red:       '#8B2020',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'amount-xl': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'amount-lg': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      boxShadow: {
        'card':      '0 2px 12px rgba(61, 29, 10, 0.10)',
        'card-hover':'0 4px 20px rgba(61, 29, 10, 0.18)',
        'inner-sm':  'inset 0 1px 3px rgba(61, 29, 10, 0.08)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.5rem',
      },
    },
  },
  plugins: [],
};
