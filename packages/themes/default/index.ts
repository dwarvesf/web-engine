// Export all components
export * from './components';

// Export theme manifest
export { default as themeManifest } from './theme.json';

// Export theme configuration
export { default as themeConfig } from './tailwind.config';

// Theme metadata
export const themeName = 'default';
export const themeVersion = '1.0.0';
export const themeDescription =
  'Default app theme for Dwarves Foundation websites';

// Theme capabilities
export const themeCapabilities = {
  supportsDarkMode: true,
  supportsRTL: false,
  supportsCustomColors: true,
  supportsCustomFonts: true,
  atomicDesign: true,
  responsive: true,
  accessibility: true,
};

// Default theme configuration
export const defaultThemeConfig = {
  colors: {
    primary: '#e13f5e',
    primaryHover: '#c73650',
    background: '#ffffff',
    foreground: '#171717',
  },
  fonts: {
    sans: 'IBM Plex Sans',
    mono: 'IBM Plex Mono',
  },
  layout: {
    containerMaxWidth: '1200px',
    headerHeight: '64px',
  },
};
