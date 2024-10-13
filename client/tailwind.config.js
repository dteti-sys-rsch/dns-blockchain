/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
    colors: {
      primary: "#222831",
      secondary: "#393E46",
      accent: "#00ADB5",
      red: "#982B1C",
      black: "#101010",
      white: "#F3F3F3",
      realWhite: "#FFFFFF",
    },
    
  },
  plugins: [],
};
