import themeConfig from 'default/tailwind.config.mjs';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/global/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/default/{components/modules}/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [themeConfig],
};

export default config;
