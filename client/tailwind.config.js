/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}", "./public/index.html"],

  theme: {
    extend: {
      width: {
        main: "1220px",
      },
      backgroundColor: {
        main: "#ee3131",
      },
      colors: {
        main: "#ee3131",
      },
    },
  },
  plugins: [],
};
