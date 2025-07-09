export interface ThemeConfig {
  name: string;
  cssPath: string;
  components?: Record<string, unknown>;
  layouts?: Record<string, unknown>;
  functions?: unknown;
}

enum ThemeName {
  Default = 'default',
}

export class ThemeAdapter {
  private static instance: ThemeAdapter;
  private currentTheme: string = ThemeName.Default;
  private themeRegistry: Map<string, ThemeConfig> = new Map();
  private isDarkMode: boolean = false;

  private constructor() {
    this.registerDefaultThemes();
    this.initializeDarkMode();
  }

  static getInstance(): ThemeAdapter {
    if (!ThemeAdapter.instance) {
      ThemeAdapter.instance = new ThemeAdapter();
    }
    return ThemeAdapter.instance;
  }

  private registerDefaultThemes() {
    this.themeRegistry.set('default', {
      name: 'default',
      cssPath: '@wse/theme-default-app/styles',
    });
  }

  registerTheme(config: ThemeConfig) {
    this.themeRegistry.set(config.name, config);
  }

  setTheme(themeName: string) {
    if (this.themeRegistry.has(themeName)) {
      this.currentTheme = themeName;
    } else {
      console.warn(`Theme "${themeName}" not found. Using default theme.`);
    }
  }

  initializeFromConfig(themeName: string) {
    this.setTheme(themeName);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  getThemeConfig(themeName?: string): ThemeConfig | undefined {
    return this.themeRegistry.get(themeName || this.currentTheme);
  }

  getThemeCssPath(themeName?: string): string | undefined {
    return this.getThemeConfig(themeName)?.cssPath;
  }

  getAllThemes(): string[] {
    return Array.from(this.themeRegistry.keys()) as string[];
  }

  loadImportComponents(themeName?: string) {
    switch (themeName || this.currentTheme) {
      case ThemeName.Default:
      default:
        return import('@wse-themes/default/components');
    }
  }

  async loadAllThemeComponents(themeName?: string) {
    const theme = themeName || this.currentTheme;
    const components = await this.loadImportComponents(theme);
    return components;
  }

  loadImportThemeFunctions(themeName?: string) {
    switch (themeName || this.currentTheme) {
      case ThemeName.Default:
      default:
        return import('@wse-themes/default/functions');
    }
  }

  async loadThemeFunctions(themeName?: string) {
    const theme = themeName || this.currentTheme;
    const functions = await this.loadImportThemeFunctions(theme);
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
