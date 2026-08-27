/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EDEDE7",
        "paper-card": "#F7F6F2",
        ink: "#1F2420",
        "ink-muted": "#5B6158",
        stamp: {
          DEFAULT: "#2F6F62",
          light: "#E4EEEB",
        },
        warn: {
          DEFAULT: "#C97A2E",
          light: "#F5E9DA",
        },
        danger: {
          DEFAULT: "#B4453A",
          light: "#F5E2E0",
        },
        line: "#D8D6CD",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
