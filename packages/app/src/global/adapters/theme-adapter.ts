import * as ThemePackage from '@wse/generated/theme';

export interface ThemeConfig {
  name: string;
  cssPath: string;
  components?: Record<string, unknown>;
  layouts?: Record<string, unknown>;
  functions?: unknown;
}

export class ThemeAdapter {
  private static instance: ThemeAdapter;
  private isDarkMode: boolean = false;

  private constructor() {
    this.initializeDarkMode();
  }

  static getInstance(): ThemeAdapter {
    if (!ThemeAdapter.instance) {
      ThemeAdapter.instance = new ThemeAdapter();
    }
    return ThemeAdapter.instance;
  }

  loadAllThemeComponents() {
    const components = ThemePackage.THEME_COMPONENTS;
    return components;
  }

  loadThemeFunctions() {
    const functions = ThemePackage.THEME_FUNCTIONS;
    return functions;
  }

  private initializeDarkMode() {
    if (typeof window !== 'undefined') {
      // Check for saved theme preference or system preference
      const savedTheme = localStorage.getItem('theme-mode');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        this.isDarkMode = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches;
      }
      this.applyDarkMode();
    }
  }

  private applyDarkMode() {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (this.isDarkMode) {
        html.setAttribute('data-theme', 'dark');
        html.classList.add('dark');
      } else {
        html.removeAttribute('data-theme');
        html.classList.remove('dark');
      }
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode();

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', this.isDarkMode ? 'dark' : 'light');
    }

    return this.isDarkMode;
  }

  setDarkMode(isDark: boolean) {
    this.isDarkMode = isDark;
    this.applyDarkMode();

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', this.isDarkMode ? 'dark' : 'light');
    }
  }

  getDarkMode(): boolean {
    return this.isDarkMode;
  }
}

export const themeAdapter = ThemeAdapter.getInstance();
