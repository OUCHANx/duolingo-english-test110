import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 青 = 主アクション / Reading 系
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        // 緑 = 達成 / 完了 / 進捗 / Listening 系
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        // 白基調の面・境界
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          border: "#e2e8f0",
        },
        // テキスト3階調
        ink: {
          DEFAULT: "#0f172a",
          soft: "#475569",
          faint: "#94a3b8",
        },
        danger: "#ef4444",
        warn: "#f59e0b",
      },
      borderRadius: {
        card: "1rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,23,42,.08)",
        float: "0 8px 24px rgba(15,23,42,.12)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Noto Sans JP",
          "Meiryo",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
