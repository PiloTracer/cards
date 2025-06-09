// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",        // blue-500
        "primary-foreground": "#ffffff",
        muted: "#6b7280",          // gray-500
        background: "#f9fafb",     // gray-50
        "background-dark": "#111827", // gray-900
        sidebar: {
          bg: "#1f2937",           // gray-800
          text: "#d1d5db",         // gray-300
          hover: "#374151",        // gray-700
          activeBg: "#111827",     // gray-900
          activeText: "#f9fafb"    // gray-50
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      }
    }
  },
  plugins: []
};
