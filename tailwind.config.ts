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
        "nt-color-3" :"#fa6e6e",
        "nt-color-4" :"#f66b73",
        "nt-color-5" :"#f26878",
        "nt-color-6" :"#ed667d",
        "nt-color-7" :"#e86482",
        "nt-color-8" :"#e26286",
        "nt-color-9" :"#dc618a",
        "nt-color-10" :"#d5618e",
        "nt-color-11" :"#ce6091",
        "nt-color-12" :"#c76094",
        "nt-color-13" :"#bf6096",
        "nt-color-14" :"#b76098",
        "nt-color-15" :"#af6099",
        "nt-color-16" :"#a7609a",
        "nt-color-17" :"#9f609b",
        "nt-color-18" :"#96609b",
        "nt-color-19" :"#8e609b",
        "nt-color-20" :"#855f9a",
        "nt-color-21" :"#7d5f98",
        "nt-color-22" :"#745f97",
        "nt-color-23" :"#6c5e94",
        "nt-color-24" :"#655d92",
        "nt-color-25" :"#5d5d8f",
        "nt-color-26" :"#565c8b",
        "nt-color-27" :"#4f5a88",
        "nt-color-28" :"#485984",
        "nt-color-29" :"#42587f",
        "nt-color-30" :"#3d567b",
        "nt-color-31" :"#385476",
        "nt-color-32" :"#345371",
        "nt-color-33" :"#31516c",
        "nt-color-34" :"#2e4f67",
        "nt-color-35" :"#2c4d62"
      },
    },
  },
  plugins: [],
};
export default config;
