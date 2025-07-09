import themeConfig from '@wse-themes/default/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/global/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@wse-themes/*/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [themeConfig],
};

export default config;
