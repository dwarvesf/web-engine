import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import {
  COPIED_SITE_CONTENT_JSON,
  GENERATED_OUTDIR,
  ORIGINAL_SITE_CONFIG_CONTENT,
} from './paths';

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
  site: {
    title: string;
    description: string;
    url: string;
  };
  favicon?: string;
  header: HeaderConfig;
  navigation?: NavigationConfig;
  footer?: FooterConfig;
  [key: string]: unknown;
}

export const defaultSiteConfig: SiteConfig = {
  theme: 'default',
  language: 'en',
  site: {
    title:
      'Dwarves Foundation - We build software with Go, React, K8s, Swift and Flutter',
    description:
      'A software development firm based in Asia. Helping tech startups, entrepreneurs and makers build world-class products since 2013.',
    url: 'https://dwarves.foundation',
  },
  favicon: '/favicon.ico',
  header: {
    logo: {
      src: '/logo.svg',
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

class SiteConfigProcessor {
  private configPath: string;
  private outputPath: string;

  constructor() {
    this.configPath = ORIGINAL_SITE_CONFIG_CONTENT;
    this.outputPath = COPIED_SITE_CONTENT_JSON;
  }

  async process(): Promise<SiteConfig> {
    const config = this.loadConfig();
    await this.generateStaticConfig(config);
    await this.generateGlobalCss(config);
    return config;
  }

  private loadConfig(): SiteConfig {
    try {
      if (!existsSync(this.configPath)) {
        console.warn('site.json not found, using default configuration');
        return defaultSiteConfig;
      }

      const configContent = readFileSync(this.configPath, 'utf-8');
      const parsedConfig = JSON.parse(configContent);

      return this.mergeWithDefaults(parsedConfig);
    } catch (error) {
      console.error(
        'Failed to load site.json, using default configuration:',
        error,
      );
      return defaultSiteConfig;
    }
  }

  private mergeWithDefaults(userConfig: unknown): SiteConfig {
    const config = userConfig as Record<string, unknown>;
    return {
      theme: (config.theme as string) || defaultSiteConfig.theme,
      language: (config.language as string) || defaultSiteConfig.language,
      site: {
        ...defaultSiteConfig.site,
        ...((config.site as {
          title: string;
          description: string;
          url: string;
        }) || {}),
      },
      favicon: (config.favicon as string) || defaultSiteConfig.favicon,
      header: {
        ...defaultSiteConfig.header,
        ...((config.header as HeaderConfig) || {}),
      },
      navigation: {
        ...defaultSiteConfig.navigation,
        ...((config.navigation as NavigationConfig) || {}),
      },
      footer: {
        ...defaultSiteConfig.footer,
        ...((config.footer as FooterConfig) || {}),
      },
      ...config,
    };
  }

  private async generateStaticConfig(config: SiteConfig): Promise<void> {
    const outputDir = GENERATED_OUTDIR;

    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    const staticConfig = {
      theme: config.theme,
      language: config.language,
      plugins: config.plugins,
      site: config.site,
      favicon: config.favicon,
      header: config.header,
      navigation: config.navigation,
      footer: config.footer,
    };

    writeFileSync(this.outputPath, JSON.stringify(staticConfig, null, 2));
    console.log('✅ Generated static site config at:', this.outputPath);
  }

  private async generateGlobalCss(config: SiteConfig): Promise<void> {
    const globalCssPath = join(GENERATED_OUTDIR, 'globals.css');

    // const pluginsStr = JSON.stringify(config.plugins, null, 2)
    //   .replace(/"/g, "'")
    //   .replace(/'([a-zA-Z0-9_-]+)':/g, '$1:')
    //   .replace(/,(\s*})/g, '$1');

    const globalCssImports = `/* This file is auto-generated by the process-site-config script.
 * Do not edit this file directly.
 */

@import '@wse-themes/${config.theme}/styles/styles.css';
`;

    writeFileSync(globalCssPath, globalCssImports);
    console.log('✅ Generated global CSS imports at:', globalCssPath);
  }
}

export async function processSiteConfig(): Promise<SiteConfig> {
  const processor = new SiteConfigProcessor();
  return await processor.process();
}

// CLI execution
if (require.main === module) {
  processSiteConfig()
    .then(() => {
      console.log('✅ Site configuration processed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Failed to process site configuration:', error);
      process.exit(1);
    });
}
