import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "player-0": "red",
        "player-1": "blue",
        "player-2": "green",
        "player-3": "orange",
      },
      boxShadow: {
        "hl": "0 0 5px 2px",
      },
    },
  },
  plugins: [],
};
export default config;
