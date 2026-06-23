/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#FAF6EC',
        surfaceAlt: '#F1EAD9',
        ink: '#1B3A4B',
        inkMuted: '#5B6B6F',
        accent: '#D4622A',
        accentDark: '#B14F1E',
        sage: '#4F7C6F',
        ticketBorder: '#DDD2BA',
        danger: '#B23A2E'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(27,58,75,0.06) 1px, transparent 0)"
      },
      backgroundSize: {
        grain: '18px 18px'
      }
    }
  },
  plugins: []
};
