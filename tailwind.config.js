/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Pokemon type colors
        red: {
          DEFAULT: "#EF4444",
          foreground: "#ffffff",
        },
        blue: {
          DEFAULT: "#3B82F6",
          foreground: "#ffffff",
        },
        green: {
          DEFAULT: "#10B981",
          foreground: "#ffffff",
        },
        yellow: {
          DEFAULT: "#F59E0B",
          foreground: "#ffffff",
        },
        purple: {
          DEFAULT: "#8B5CF6",
          foreground: "#ffffff",
        },
        pink: {
          DEFAULT: "#EC4899",
          foreground: "#ffffff",
        },
        indigo: {
          DEFAULT: "#6366F1",
          foreground: "#ffffff",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          foreground: "#ffffff",
        },
        lime: {
          DEFAULT: "#84CC16",
          foreground: "#ffffff",
        },
        amber: {
          DEFAULT: "#D97706",
          foreground: "#ffffff",
        },
        sky: {
          DEFAULT: "#0EA5E9",
          foreground: "#ffffff",
        },
        stone: {
          DEFAULT: "#78716C",
          foreground: "#ffffff",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          foreground: "#ffffff",
        },
        zinc: {
          DEFAULT: "#52525B",
          foreground: "#ffffff",
        },
        slate: {
          DEFAULT: "#64748B",
          foreground: "#ffffff",
        },
        neutral: {
          DEFAULT: "#737373",
          foreground: "#ffffff",
        },
        rose: {
          DEFAULT: "#F43F5E",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
}
