import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {}, // You don’t need to hardcode colors here, they come from globals.css
  },
  darkMode: "class", // enables .dark mode
  plugins: [],
};

export default config;

