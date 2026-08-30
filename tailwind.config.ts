import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12211D",
        paper: "#F5F6F3",
        surface: "#FFFFFF",
        teal: {
          50: "#EEF4F2",
          100: "#D7E5E0",
          300: "#7FA79A",
          500: "#3E7C6B",
          700: "#28564A",
          900: "#0F2E2B",
        },
        amber: {
          100: "#F3DFC8",
          300: "#E0AD79",
          500: "#C97A3D",
          700: "#9A5A28",
        },
        line: "#DCE1DD",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
      keyframes: {
        culture: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0.85" },
        },
        driftSlow: {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(14px,-10px)" },
        },
      },
      animation: {
        culture: "culture 1.8s ease-out forwards",
        driftSlow: "driftSlow 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
