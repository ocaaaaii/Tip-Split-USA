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
        // All palette colors reference CSS custom properties so dark mode works correctly.
        cream: {
          bg:     'var(--cream-bg)',
          card:   'var(--cream-card)',
          border: 'var(--cream-border)',
          deep:   'var(--cream-card)',   // alias — same as card
        },
        mocha: {
          dark:  'var(--mocha-dark)',
          mid:   'var(--mocha-mid)',
          light: 'var(--mocha-light)',
          pale:  'var(--cream-border)',  // alias
        },
        accent: {
          warm:      'var(--accent-warm)',
          warmHover: '#5A7A92',
          sage:      'var(--accent-sage)',
          sky:       '#8BAFC4',
          orange:    'var(--accent-orange)',
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
