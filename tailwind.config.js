/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['"Outfit"', "sans-serif"], // Added the Outfit font
      },
    },
  },
  plugins: [],
};
