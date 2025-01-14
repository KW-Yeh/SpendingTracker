import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        text: "var(--text)",
        "primary-100": "var(--primary-100)",
        "primary-300": "var(--primary-300)",
        "primary-500": "var(--primary-500)",
        "primary-700": "var(--primary-700)",
        "primary-900": "var(--primary-900)",
      },
      spacing: {
        175: '43.75rem', // 700px
      }
    },
  },
  plugins: [],
} satisfies Config;
