import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0,0%,100%)',
        'background-gray': 'hsl(0,0%,90%)',
        text: 'hsl(0,0%,0%)',
        'text-gray': 'hsl(0,0%,60%)',
        primary: {
          100: 'hsl(256, 70%, 90%)',
          200: 'hsl(256, 70%, 80%)',
          300: 'hsl(256, 70%, 70%)',
          400: 'hsl(256, 70%, 60%)',
          500: 'hsl(256, 70%, 50%)',
          600: 'hsl(256, 70%, 40%)',
          700: 'hsl(256, 70%, 30%)',
          800: 'hsl(256, 70%, 20%)',
          900: 'hsl(256, 70%, 10%)',
        },
      },
      spacing: {
        175: '43.75rem', // 700px
      },
    },
  },
  plugins: [],
} satisfies Config;
