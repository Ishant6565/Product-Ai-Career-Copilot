import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#000000",
        muted: "#F5F5F5",
        mutedForeground: "#525252",
        accent: "#000000",
        accentForeground: "#FFFFFF",
        border: "#000000",
        borderLight: "#E5E5E5",
        card: "#FFFFFF",
        cardForeground: "#000000",
        ring: "#000000",
        mono: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        body: ["Source Serif 4", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Source Serif 4", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": "0.65rem",
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3.5rem",
        "6xl": "4.5rem",
        "7xl": "6rem",
        "8xl": "8rem",
        "9xl": "10rem",
      },
      borderWidth: {
        1: "1px",
        3: "3px",
        4: "4px",
        8: "8px",
      },
      transitionDuration: {
        0: "0ms",
        100: "100ms",
      },
    },
  },
  plugins: [],
};

export default config;

