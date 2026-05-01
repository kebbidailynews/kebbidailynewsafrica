// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-barlow)", "Arial", "sans-serif"],
        condensed: ["var(--font-barlow-condensed)", "Arial Narrow", "sans-serif"],
      },
      colors: {
        red: {
          kdn: "#CC0000",
          "kdn-dark": "#AA0000",
        },
        gray: {
          950: "#0A0A0A",
        },
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        marquee: "marquee 35s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;