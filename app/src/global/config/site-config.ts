import _staticConfig from '../../generated/site-config.json';

export interface TabType {
  tab: string;
  href?: string;
  type?: string[] | string;
  tag?: string;
  groups?: {
    group: string;
    tag?: string;
    pages: (string | [string, string])[];
  }[];
}

export interface LogoConfig {
  src: string;
  alt: string;
  href: string;
}

export interface NavigationConfig {
  position?: 'header' | 'aside';
  tabs: TabType[];
}

export interface HeaderConfig {
  logo: LogoConfig;
  navigation: NavigationConfig;
}

export interface SocialConfig {
  [key: string]: string | [string, string] | [string, string, string];
}

export interface FooterColumnSection {
  title?: string;
  href?: string;
  'hide-title'?: boolean;
  content?: {
    type: string;
    title: string;
    text: string;
  }[];
  socials?: SocialConfig;
  tabs?: {
    tab: string;
    href: string;
    type?: string[];
    tag?: string;
  }[];
}

export interface FooterConfig {
  global?: {
    text: string;
    email: string;
    socials?: SocialConfig;
  };
  'column-sections'?: FooterColumnSection[];
  sections?: FooterColumnSection[];
}

export interface SiteConfig {
  theme: string;
  language: string;
  plugins?: Record<
    string,
    {
      enabled: boolean;
      config?: unknown;
    }
  >;
  site: {
    title: string;
    description: string;
    url: string;
  };
  favicon?: string;
  thumbnail?: string;
  header: HeaderConfig;
  navigation?: NavigationConfig;
  footer?: FooterConfig;
}

export const defaultSiteConfig: SiteConfig = {
  theme: 'default',
  language: 'en',
  plugins: {
    'docs-config': {
      enabled: true,
    },
    'mdx-processing': {
      enabled: true,
    },
  },
  site: {
    title:
      'Dwarves Foundation - We build software with Go, React, K8s, Swift and Flutter',
    description:
      'A software development firm based in Asia. Helping tech startups, entrepreneurs and makers build world-class products since 2013.',
    url: 'https://dwarves.foundation',
  },
  favicon: 'content/favicon.ico',
  header: {
    logo: {
      src: 'content/logo.svg',
      alt: 'Dwarves Foundation Logo',
      href: '/',
    },
    navigation: {
      position: 'header',
      tabs: [],
    },
  },
  navigation: {
    tabs: [],
  },
  footer: {
    global: {
      text: 'Dwarves, LLC © 2015 - 2025 All rights reserved.',
      email: 'team@dwarves.foundation',
    },
    'column-sections': [],
    sections: [],
  },
};

export class SiteConfigLoader {
  private static instance: SiteConfigLoader;
  private config: SiteConfig | null = null;
  private readonly staticConfig = this.recursivePathResolver(
    _staticConfig,
  ) as unknown as SiteConfig | undefined;
  /**
   * Base path URL for the site, used to resolve relative paths.
   * This is set from the environment variable NEXT_PUBLIC_PAGES_BASE_PATH.
   */
  public static BASE_PATH_URL = (() => {
    const basePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || '';
    if (!basePath) {
      return '';
    }
    // Ensure the base path starts with a slash
    return basePath.startsWith('/') ? basePath : `/${basePath}`;
  })();

  private constructor() {}

  static getInstance(): SiteConfigLoader {
    if (!SiteConfigLoader.instance) {
      SiteConfigLoader.instance = new SiteConfigLoader();
    }
    return SiteConfigLoader.instance;
  }

  private pathResolver(path: string): string {
    const prefix = SiteConfigLoader.BASE_PATH_URL;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path; // External URL, no change needed
    }
    if (path.startsWith('/') && !path.startsWith('/content/')) {
      // If the path starts with '/', treat it as an absolute path
      return `${prefix}/content${path}`;
    }
    if (path.startsWith('/content/')) {
      return `${prefix}${path}`; // Already a content-relative path
    }
    // Resolve relative paths based on the current working directory
    return `${prefix}/content/${path}`;
  }

  private recursivePathResolver(
    obj?: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    if (!obj || typeof obj !== 'object') {
      return;
    }
    const resolvedObj: Record<string, unknown> = {};
    const keys = ['src', 'url', 'favicon', 'icon', 'image'];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && keys.includes(key)) {
        resolvedObj[key] = this.pathResolver(value);
      } else if (Array.isArray(value)) {
        resolvedObj[key] = value.map(item =>
          typeof item === 'string' && keys.includes(key)
            ? this.pathResolver(item)
            : item,
        );
      } else if (typeof value === 'object' && value !== null) {
        resolvedObj[key] = this.recursivePathResolver(
          value as Record<string, unknown>,
        );
      } else {
        resolvedObj[key] = value; // Keep other types as is
      }
    }
    return resolvedObj;
  }

  loadConfig(): SiteConfig {
    if (this.config) {
      return this.config;
    }

    try {
      this.config = this.staticConfig as unknown as SiteConfig;
      return this.config || defaultSiteConfig;
    } catch (error) {
      console.warn(
        'Failed to load generated site config, using default configuration:',
        error,
      );
      this.config = defaultSiteConfig;
      return this.config;
    }
  }

  getConfig(): SiteConfig {
    if (!this.config) {
      return this.loadConfig();
    }
    return this.config;
  }

  reloadConfig(): SiteConfig {
    this.config = null;
    return this.loadConfig();
  }

  updateConfig(updates: Partial<SiteConfig>): void {
    if (!this.config) {
      this.loadConfig();
    }

    this.config = {
      ...this.config!,
      ...updates,
    };
  }
}

export const siteConfigLoader = SiteConfigLoader.getInstance();
export const getSiteConfig = () => siteConfigLoader.getConfig();
