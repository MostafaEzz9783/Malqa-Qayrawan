/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bronze: "#BF7C4A",
        purple: "#5B3FD6",
        canvas: "#F7F6F3",
        darkSurface: "#151522",
        card: "#1D1D2D",
      },
      fontFamily: {
        sans: ["Inter", "Cairo", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px -15px rgba(191, 124, 74, 0.35)",
        glowPurple: "0 20px 60px -15px rgba(91, 63, 214, 0.35)",
        premium: "0 30px 80px -20px rgba(15, 15, 26, 0.45)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, -24px, 0) rotate(4deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 24s ease-in-out infinite",
        floatSlow: "float 30s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
