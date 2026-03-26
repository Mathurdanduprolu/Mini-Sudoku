/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0b1020',
          panel: '#111a34',
          panelSoft: '#192244',
          text: '#e8edff',
          muted: '#94a3c4',
          accent: '#4fd1ff',
          violet: '#8f7cff',
          emerald: '#2dd4bf',
          coral: '#fb7185',
          amber: '#fbbf24',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(79,209,255,.2), 0 8px 30px rgba(3, 10, 25, 0.55)',
      },
      backgroundImage: {
        gridGlow:
          'radial-gradient(circle at top right, rgba(79,209,255,.2), transparent 35%), radial-gradient(circle at bottom left, rgba(143,124,255,.2), transparent 40%)',
      },
    },
  },
  plugins: [],
};
