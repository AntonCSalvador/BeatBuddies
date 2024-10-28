/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './screens/**/*.{js,jsx,ts,tsx}',
        './utils/**/*.{js,jsx,ts,tsx}',
        './hooks/**/*.{js,jsx,ts,tsx}',
        './contexts/**/*.{js,jsx,ts,tsx}',
      ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

