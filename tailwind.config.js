/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ✅ Custom brand colors (example, adjust to your theme)
        brand: {
          DEFAULT: "#1d4ed8", // primary blue
          dark: "#1e40af",
          light: "#3b82f6",
        },
      },

      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px",
      },

      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [
    // ✅ Add Tailwind plugins you’ll likely use
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"), // used by shadcn/ui
  ],
}
