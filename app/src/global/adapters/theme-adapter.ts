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
  private isEnabledToggleDarkMode: boolean = (() => {
    const envEnabled = process.env.NEXT_PUBLIC_ENABLED_DARK_MODE;
    return envEnabled === 'true';
  })();

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

  loadThemeModules() {
    const modules = ThemePackage.THEME_MODULES;
    return modules;
  }

  private initializeDarkMode() {
    if (typeof window !== 'undefined' && this.isEnabledToggleDarkMode) {
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
    if (typeof window !== 'undefined' && this.isEnabledToggleDarkMode) {
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
