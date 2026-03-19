import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#e64cbf',
        'background-light': '#FFF7F9',
        'background-dark': '#21111d',
        'surface': '#FFFFFF',
        'surface-light': '#FFF7F9',
        'text-main': '#3D3140',
        'text-muted': '#6B5E70',
        'muted': '#6B5E70',
        'accent': '#FAD59B',
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'body': ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'glow': '0 20px 40px -10px rgba(230, 76, 191, 0.25)',
        'glow-hover': '0 30px 50px -10px rgba(230, 76, 191, 0.4)',
        'seal': '0 8px 16px rgba(0,0,0,0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up-fade': 'slideUpFade 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        slideUpFade: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
