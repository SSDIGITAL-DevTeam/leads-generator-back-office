import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        background: "#F1F5F9",
        dark: "#0F172A",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 20px 45px -15px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
