/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF9800',    // Flutter版のColors.orangeに近い色
        secondary: '#FF5722',  // グラデーション用
        background: '#F5F5F5',
      },
    },
  },
  plugins: [],
}
