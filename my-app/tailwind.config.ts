import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#FCFCFE",
        text: "#1C202A",
        primary: {
          100: '#FCFCFE',
          200: '#F2F1FF',
          300: '#DFD9FF',
          400: '#BFB5FD',
          500: '#7B56E1',
          600: '#6D4EC6',
          700: '#694AC2',
          800: '#332263',
          900: '#1d1337',
        }
      },
      spacing: {
        175: '43.75rem', // 700px
      }
    },
  },
  plugins: [],
} satisfies Config;
