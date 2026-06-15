/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: '#080C10',
        surface: '#0D1117',
        border: '#1C2333',
        muted: '#8B98A9',
        accent: {
          cyan: '#00E5FF',
          green: '#00FF87',
          red: '#FF3D57',
          yellow: '#FFD60A',
          purple: '#BD93F9',
        }
      },
      keyframes: {
        radarPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'radar-pulse': 'radarPulse 2s ease-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
      }
    }
  },
  plugins: []
}
