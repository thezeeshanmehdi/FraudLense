/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#030014",        // Deep space black
          panel: "rgba(10, 8, 28, 0.6)", // Glassmorphism container base
          border: "rgba(124, 58, 237, 0.2)", // Subtle purple borders
          "border-hover": "rgba(0, 242, 254, 0.4)", // Cyber cyan borders on hover
          text: "#f3f4f6",      // Primary light gray
          muted: "#9ca3af",     // Secondary text
          cyan: "#00f2fe",      // Neon Cyan
          purple: "#7c3aed",    // Neon Purple
          violet: "#a78bfa",    // Light Purple
          pink: "#ec4899",      // Neon Pink
          green: "#10b981",     // Safe Green
          yellow: "#fbbf24",    // Alert Yellow
          red: "#ef4444"        // Danger Red
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 242, 254, 0.35)',
        'glow-purple': '0 0 15px rgba(124, 58, 237, 0.35)',
        'glow-pink': '0 0 15px rgba(236, 72, 153, 0.35)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.35)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%237c3aed' fill-opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'radar': 'radar 8s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
