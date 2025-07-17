import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'create-hubspot-contact': 'create-hubspot-contact.ts',
    'emailer': 'emailer.ts',
  },
  format: ['cjs'], // Use CommonJS for better bundling
  dts: false,
  clean: true,
  minify: true,
  noExternal: ['busboy', '@sendgrid/mail', 'axios'], // Explicitly bundle these packages
  platform: 'node', // Target Node.js platform
  outDir: 'dist',
  target: 'es2020',
  outExtension() {
    return {
      js: `.js`,
    };
  },
});
