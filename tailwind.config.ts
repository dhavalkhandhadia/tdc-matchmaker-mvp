import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)', surface: 'var(--surface)', wash: 'var(--wash)',
        ink: 'var(--ink)', muted: 'var(--muted)', faint: 'var(--faint)',
        line: 'var(--line)', 'line-strong': 'var(--line-strong)',
        accent: 'var(--accent)', 'accent-strong': 'var(--accent-strong)', 'accent-soft': 'var(--accent-soft)',
        calm: 'var(--calm)', 'calm-soft': 'var(--calm-soft)', warning: 'var(--warning)', 'warning-soft': 'var(--warning-soft)',
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
      },
    },
  },
  plugins: [],
};
export default config;
