/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        invest: {
          dark: '#0f172a',
          navy: '#1e293b',
          card: '#ffffff',
          primary: '#0f766e',     // Verde/Teal institucional RPPS
          accent: '#0284c7',      // Azul Investidor10
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          grayBg: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}
