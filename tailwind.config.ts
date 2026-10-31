import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FBD9CF",
        ink: "#14110F",
        cobalt: "#1F5FD0",
        "cobalt-text": "#1A52B8",
        mint: "#BFE5D3",
        sun: "#F6C945",
        cream: "#FFF6EE",
        danger: "#B42318",
        daisy: "#DCE8FB",
        peony: "#FFE0CC",
        soda: "#D6F0E2",
        photo: "#F6C6BA",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
