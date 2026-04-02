/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f4fe",
          200: "#b3e5fc",
          300: "#81d4fa",
          400: "#4fc3f7",
          500: "#29b6f6",
          600: "#039be5",
          700: "#0277bd",
          800: "#01579b",
        },
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
      },
      fontSize: {
        "2xs": ["0.75rem", "1rem"],
        xs: ["0.875rem", "1.25rem"],
        sm: ["1rem", "1.5rem"],
        base: ["1.0625rem", "1.75rem"],
        lg: ["1.1875rem", "1.875rem"],
        xl: ["1.375rem", "2rem"],
        "2xl": ["1.5625rem", "2rem"],
        "3xl": ["1.875rem", "2.25rem"],
        "4xl": ["2.25rem", "2.5rem"],
        "5xl": ["3rem", "3.5rem"],
        "6xl": ["3.5rem", "4rem"],
        "7xl": ["4rem", "4.5rem"],
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.08)",
        md: "0 8px 20px rgba(0, 0, 0, 0.1)",
        lg: "0 12px 30px rgba(0, 0, 0, 0.12)",
        xl: "0 20px 40px rgba(0, 0, 0, 0.15)",
        "inner-soft": "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        rise: "rise 0.45s ease-out",
        slideIn: "slideIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
