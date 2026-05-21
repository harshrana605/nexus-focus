/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#050810',
          2: '#0a0f1e',
          3: '#0e1428',
        },
        border: {
          DEFAULT: '#1e293b',
          2: '#334155',
        },
        textm: '#94a3b8',
        textd: '#475569',
      },
      animation: {
        'float': 'float linear infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
}
