import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F4F3EF",
        ink: "#101C2D",
        cobalt: "#173B66",
        "cobalt-text": "#234D7A",
        mint: "#E4E9E7",
        sun: "#D7BE8A",
        cream: "#FAFAF7",
        danger: "#B42318",
        daisy: "#DCE8FB",
        peony: "#EDE5D9",
        soda: "#E4E9E7",
        photo: "#E9ECF0",
      },
      fontFamily: {
        display: ["var(--font-be-vietnam)", "sans-serif"],
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
