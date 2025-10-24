/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        premium: [
          'Pretendard',
          'Montserrat',
          'Noto Sans KR',
          'Inter',
          'Apple SD Gothic Neo',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gold: {
          50: '#fffbe6',
          100: '#fff3bf',
          200: '#ffe066',
          300: '#ffd700',
          400: '#ffc300',
          500: '#b8860b',
          600: '#a67c00',
          700: '#8c6d1f',
          800: '#7c5c00',
          900: '#5c4100',
        },
        navy: {
          50: '#f4f8fb',
          100: '#e6ecf3',
          200: '#cfd8e3',
          300: '#a3b4c9',
          400: '#6c8bb7',
          500: '#25406f',
          600: '#1a2e4a',
          700: '#14213d',
          800: '#0d1626',
          900: '#070a13',
        },
        black: '#181818',
        white: '#ffffff',
        gradient: {
          gold: 'linear-gradient(90deg, #ffd700 0%, #b8860b 100%)',
          navy: 'linear-gradient(90deg, #25406f 0%, #14213d 100%)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}