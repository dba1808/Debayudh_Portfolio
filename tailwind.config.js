/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "violet-accent": "#915eff",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        "card-hover": "0px 45px 140px -15px #322d5a",
        button: "0px 10px 40px -10px #915eff",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(135deg, rgba(5, 8, 22, 0.95) 0%, rgba(21, 16, 48, 0.9) 50%, rgba(5, 8, 22, 0.95) 100%)",
      },
    },
  },
  plugins: [],
};
