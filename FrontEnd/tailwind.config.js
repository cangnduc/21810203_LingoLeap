/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // This enables dark mode

  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3B82F6", // blue-500
          dark: "#60A5FA", // blue-400
        },
        secondary: {
          light: "#10B981", // emerald-500
          dark: "#34D399", // emerald-400
        },
        background: {
          light: "#F3F4F6", // gray-100
          dark: "#1F2937", // gray-800
        },
        text: {
          light: "#1F2937", // gray-800
          dark: "#F9FAFB", // gray-50
        },
        button: {
          light: "#2563EB", // blue-600
          dark: "#3B82F6", // blue-500
        },
        box: {
          light: "#FFFFFF", // white
          dark: "#374151", // gray-700
        },
        border: {
          light: "#D1D5DB", // gray-300
          dark: "#4B5563", // gray-600
        },
        darker_blue: "#000000",
        dark_blue: "#01003b",
        lighter_blue: "#d1e1e3",
        light_blue: "#e6f7ff",
        blue1: "#000000",
        blue2: "#1c1cff",
        blue3: "#3939ff",
        blue4: "#5555ff",
        blue5: "#7272ff",
        blue6: "#8f8fff",
        blue7: "#ababff",
        blue8: "#c8c8ff",
        blue9: "#e5e5ff",
        blue10: "#ffffff",
      },
      boxShadow: {
        light:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        dark: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        "gradient-light": "linear-gradient(to right, #F3F4F6, #E5E7EB)",
        "gradient-dark": "linear-gradient(to right, #1F2937, #111827)",
        "button-gradient-light": "linear-gradient(to right, #2563EB, #3B82F6)",
        "button-gradient-dark": "linear-gradient(to right, #1D4ED8, #3B82F6)",
      },
      // Add custom filter for dark mode
      filter: {
        "dark-filter": "brightness(0.75) contrast(1.2)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".custom-radial-gradient": {
          background: "radial-gradient(circle at 50% 50%, #ffffff, #dcdee4)",
        },
        ".dark-custom-radial-gradient": {
          background: "radial-gradient(circle at 50% 50%, #01003b, #000000)",
        },
        // Add the dark filter utility
        ".dark-filter": {
          filter: "brightness(0.75) contrast(1.2)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover", "dark"]);
    },
  ],
};
