/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    transitionDuration: {
      fast: "100ms",
      md: "300ms",
    },
    extend: {
      colors: {
        background: "var(--bg-color)",
        text: "var(--text-color)",
        border: "var(--border-color)",
        shadow: "var(--shadow-color)",
      },
      fontFamily: {
        sans: ["Comfortaa", ...defaultTheme.fontFamily.sans],
        mono: ['"Iosevka web"', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        "inset-hard-sm": "inset 0.05rem 0.05rem 1px 1px var(--shadow-color)",
        "inset-hard": "inset 0.1rem 0.1rem 1px 1px var(--shadow-color)",
        "inset-hard-md": "inset 0.2rem 0.2rem 2px 2px var(--shadow-color)",

        hard: "0.25rem 0.25rem 1px var(--shadow-color)",
        "hard-md": "0.5rem 0.5rem 1px var(--shadow-color)",
        "hard-lg": "1rem 1rem 1px 1px var(--shadow-color)",
        "hard-xl": "2rem 2rem 2px 2px var(--shadow-color)",

        "hard-inset":
          "0.25rem 0.25rem 1px var(--shadow-color), inset 0.1rem 0.1rem 1px 1px var(--shadow-color)",
        "hard-md-inset-sm":
          "0.5rem 0.5rem 1px var(--shadow-color), inset 0.05rem 0.05rem 1px 1px var(--shadow-color)",
        "hard-lg-inset-md":
          "1rem 1rem 1px 1px var(--shadow-color), inset 0.2rem 0.2rem 2px 2px var(--shadow-color)",
        "hard-xl-inset":
          "2rem 2rem 2px 2px var(--shadow-color), inset 0.1rem 0.1rem 1px 1px var(--shadow-color)",
      },
      dropShadow: {
        "hard-sm": "0.1rem 0.1rem var(--shadow-color)",
        hard: "0.25rem 0.25rem var(--shadow-color)",
        "hard-md": "0.5rem 0.5rem 1px var(--shadow-color)",
        "hard-lg": "1rem 1rem 1px var(--shadow-color)",
        "hard-xl": "2rem 2rem 2px var(--shadow-color)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("peer-hocus", [
        ":merge(.peer):hover ~ &",
        ":merge(.peer):focus ~ &",
      ]);
    }),
  ],
};
