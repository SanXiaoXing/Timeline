/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper:    '#F6F2EB',
        card:     '#F0EBE3',
        primary:  '#2C3639',
        muted:    '#7A7A72',
        accent:   '#D45D4A',
        link:     '#4A6B5F',
        divider:  '#E5DFD6',
        // Dark mode
        'dark-bg':     '#1E1F1D',
        'dark-card':   '#292A27',
        'dark-primary':'#E5DFD6',
        'dark-muted':  '#9E9A93',
        'dark-accent': '#E07B6A',
        'dark-link':   '#6B9A82',
        'dark-divider':'#3A3833',
      },
      fontFamily: {
        display:  ['Instrument Serif', 'Noto Serif SC', 'serif'],
        body:     ['DM Sans', 'Noto Sans SC', 'sans-serif'],
        mono:     ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs':  '0.75rem',
        'sm':  '0.875rem',
        'base':'1rem',
        'lg':  '1.125rem',
        'xl':  '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      borderRadius: {
        none: '0',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};