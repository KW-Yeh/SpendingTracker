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

        "green-100": "var(--secondary-green-100)",
        "green-300": "var(--secondary-green-300)",
        "green-500": "var(--secondary-green-500)",
        "green-700": "var(--secondary-green-700)",

        "red-300": "var(--secondary-red-300)",
        "red-500": "var(--secondary-red-500)",
        "red-700": "var(--secondary-red-700)",

        "orange-500": "var(--secondary-orange-500)",
        "orange-700": "var(--secondary-orange-700)",

        "yellow-300": "var(--secondary-yellow-300)",
        "yellow-500": "var(--secondary-yellow-500)",
      },
      spacing: {
        175: '43.75rem', // 700px
      }
    },
  },
  plugins: [],
} satisfies Config;
