
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0ea5e9',
          blueDeep: '#0284c7',
          red: '#ef4444',
          redDeep: '#dc2626',
          bg: '#07090f',
          panel: '#0d1220',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'glow-blue': '0 0 0 1px rgba(14,165,233,0.55) inset, 0 0 18px rgba(14,165,233,0.55), 0 0 42px rgba(14,165,233,0.35)',
        'glow-red': '0 0 0 2px rgba(239,68,68,0.85) inset, 0 0 22px rgba(239,68,68,0.65), 0 0 56px rgba(239,68,68,0.45)',
      },
    },
  },
}
