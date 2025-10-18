import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Habilita dark mode usando classe 'dark'
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-01': '#0F0E11',
        'background-02': '#141414',
        'dark-green': '#161716',
        'green': '#55B02E',
        'red': '#E93030',
        'dark-gray': '#1F1F21',
        'gray': '#71717A',
        'light-gray': '#B8B8B8',
      },
      keyframes: {
        floatX: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(20px)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        floatX: "floatX 6s ease-in-out infinite",
        floatY: "floatY 5s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

