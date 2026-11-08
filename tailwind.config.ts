import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sanctuary: {
          deep: '#05070f',
          dark: '#0c1021',
          navy: '#121933',
          slate: '#1b2447',
          gold: '#d4af37',
          'gold-light': '#f5e6a3',
          'gold-dark': '#8a6e1a',
          rose: '#e58c9f',
          'rose-light': '#ffd6e0',
          'rose-dark': '#b34e65',
          starlight: '#eaf4ff',
          ether: '#64dfdf',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Georgia', 'serif'],
        display: ['var(--font-cormorant)', 'Garamond', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'celestial-sm': '0 0 15px rgba(212, 175, 55, 0.15)',
        'celestial-md': '0 0 30px rgba(212, 175, 55, 0.25)',
        'celestial-lg': '0 0 50px rgba(212, 175, 55, 0.35)',
        'rose-glow': '0 0 30px rgba(229, 140, 159, 0.3)',
        'ether-glow': '0 0 30px rgba(100, 223, 223, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'float-gentle': 'floatGentle 6s ease-in-out infinite',
        'shimmer-slow': 'shimmer 8s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
