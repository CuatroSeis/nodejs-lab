/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D1117",
        surface: "#161B22",
        elevated: "#212833",
        border: "#303946",
        primary: "#8BCF68",
        secondary: "#8B8FE8",
        text: "#E6EDF3",
        "text-muted": "#919BAA",
      },
      borderRadius: {
        card: "12px",
        button: "8px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
}
