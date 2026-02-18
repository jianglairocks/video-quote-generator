/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wechat-green': '#07C160',
        'text-main': '#F2F2F2',
        'text-accent': '#07C160',
        'text-muted': 'rgba(255, 255, 255, 0.5)',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}