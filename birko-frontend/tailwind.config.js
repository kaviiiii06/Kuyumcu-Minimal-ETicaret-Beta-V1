/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        flashGreen: {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(34,197,94,0.3)" },
        },
        flashRed: {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(239,68,68,0.3)" },
        },
      },
      animation: {
        flashGreen: "flashGreen 0.5s ease",
        flashRed: "flashRed 0.5s ease",
      },
    },
  },
  plugins: [],
}
