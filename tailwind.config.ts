import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--text-main)",
        subtle: "var(--text-subtle)",
        canvas: "var(--bg-main)",
        paper: "var(--bg-soft)",
        line: "var(--line-soft)"
      },
      fontFamily: {
        serifDisplay: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "serif"],
        sansBody: ["PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "sans-serif"]
      },
      boxShadow: {
        vessel: "0 24px 80px rgba(34, 34, 34, 0.08)"
      },
      animation: {
        rise: "rise 1.1s ease-out both",
        drift: "drift 14s ease-in-out infinite"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
