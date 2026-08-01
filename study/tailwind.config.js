/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
    },
    extend: {
      colors: {
        // 墨夜主题（默认深色）
        ink: {
          950: "#06080F",
          900: "#0A0E1A",
          800: "#111726",
          700: "#1A2235",
          600: "#243049",
          500: "#334158",
          400: "#4A5670",
        },
        // 宣纸主题（浅色）
        paper: {
          50: "#FBF8F1",
          100: "#F5F1E8",
          200: "#EDE6D3",
          300: "#D9CDB0",
        },
        // 主色：朱砂红
        vermilion: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          400: "#F87171",
          500: "#E63946",
          600: "#C81E2D",
          700: "#A01825",
        },
        // 青金
        azure: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          400: "#22D3EE",
          500: "#1B9AAA",
          600: "#0E7C8A",
          700: "#155E68",
        },
        // 流光金
        aurum: {
          400: "#FBBF63",
          500: "#F4A261",
          600: "#D98434",
        },
        // 紫宸
        amethyst: {
          400: "#B07CE8",
          500: "#9D4EDD",
          600: "#7B2CC4",
        },
        // 翡翠（成功）
        jade: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "Georgia", "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Cascadia Code"', "monospace"],
      },
      borderRadius: {
        card: "16px",
        chip: "6px",
      },
      boxShadow: {
        card: "0 8px 32px rgba(0,0,0,.4)",
        float: "0 16px 48px rgba(0,0,0,.5)",
        glow: "0 0 24px rgba(230,57,70,.35)",
        "glow-azure": "0 0 24px rgba(27,154,170,.35)",
        "glow-aurum": "0 0 24px rgba(244,162,97,.35)",
      },
      backgroundImage: {
        "ink-grad": "radial-gradient(ellipse at top, #1A2235 0%, #0A0E1A 60%, #06080F 100%)",
        "paper-grad": "radial-gradient(ellipse at top, #FBF8F1 0%, #F5F1E8 60%, #EDE6D3 100%)",
        "flow-line": "linear-gradient(90deg, transparent, #1B9AAA, #9D4EDD, transparent)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "flow-dash": {
          to: { strokeDashoffset: "-100" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        breathe: "breathe 3s ease-in-out infinite",
        floaty: "floaty 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        "flow-dash": "flow-dash 2s linear infinite",
        "fade-up": "fade-up .4s ease-out both",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
