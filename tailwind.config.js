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
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // primary teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        elderly: {
          bg: '#f8fafc',
          card: '#ffffff',
          accent: '#3b82f6',
          warning: '#f59e0b',
          success: '#10b981',
          danger: '#ef4444',
          highContrastBg: '#0f172a',
          highContrastCard: '#1e293b',
        }
      },
      fontSize: {
        'elderly-base': '1.25rem', // 20px
        'elderly-lg': '1.5rem',   // 24px
        'elderly-xl': '1.875rem', // 30px
        'elderly-2xl': '2.25rem', // 36px
        'elderly-3xl': '3rem',    // 48px
      },
      boxShadow: {
        'elderly': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'elderly-lg': '0 20px 30px -10px rgba(0, 0, 0, 0.12), 0 10px 15px -5px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
