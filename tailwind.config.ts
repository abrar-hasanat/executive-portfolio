import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A192F", // primary dark background
          surface: "#112240", // elevated card surface
        },
        ink: {
          primary: "#F8FAFC", // headers
          secondary: "#94A3B8", // body copy
        },
        accent: {
          DEFAULT: "#3B82F6",
          dim: "#1D4ED8",
          faint: "rgba(59, 130, 246, 0.12)",
        },
        border: {
          DEFAULT: "#1E293B", // slate-800
          light: "#243449",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, #16263F 1px, transparent 1px), linear-gradient(to bottom, #16263F 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
