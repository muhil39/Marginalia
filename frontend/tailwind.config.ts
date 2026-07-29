import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F6F1E6",
        "parchment-deep": "#EEE6D3",
        ink: "#1B1E1C",
        "ink-deep": "#101312",
        navy: "#1D3B53",
        "navy-light": "#2C5678",
        rust: "#B3401D",
        "rust-light": "#D45C34",
        sage: "#3F6E52",
        "sage-light": "#5C9273",
        parch: {
          50: "#FBF9F3",
          100: "#F6F1E6",
          200: "#EEE6D3",
          300: "#DFD3B4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "margin-in": {
          "0%": { opacity: "0", transform: "translateX(8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "underline-draw": {
          "0%": { strokeDashoffset: "400" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "margin-in": "margin-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "underline-draw": "underline-draw 1.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
