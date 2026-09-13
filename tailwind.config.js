/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gh: {
          darkBg: '#0d1117',
          darkPanel: '#161b22',
          darkCard: '#21262d',
          darkBorder: '#30363d',
          darkMuted: '#8b949e',
          darkText: '#f0f6fc',
          lightBg: '#f6f8fa',
          lightPanel: '#ffffff',
          lightCard: '#ffffff',
          lightBorder: '#d0d7de',
          lightMuted: '#57606a',
          lightText: '#1f2328',
        },
        streak: {
          empty: '#161b22',
          emptyLight: '#ebedf0',
          l1: '#0e4429',
          l1Light: '#9be9a8',
          l2: '#006d32',
          l2Light: '#40c463',
          l3: '#26a641',
          l3Light: '#30a14e',
          l4: '#39d353',
          l4Light: '#216e39',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.15)',
        'elevated-dark': '0 8px 30px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
