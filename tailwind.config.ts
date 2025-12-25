import type { Config } from "tailwindcss";
import { theme as baseTheme } from "./src/shared/repo/theme/tailwind";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/repo/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/utils/**/*.{js,ts,jsx,tsx,mdx}",
    // Exclude node_modules - Tailwind will automatically ignore them if we're specific
  ],
  theme: {
    ...baseTheme,
  },
  plugins: [],
};

export default config;
