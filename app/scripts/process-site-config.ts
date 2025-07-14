import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { copyFile, mkdir } from 'fs/promises';
import {
  COPIED_SITE_CONTENT_JSON,
  GENERATED_OUTDIR,
  ORIGINAL_CONTENT,
  ORIGINAL_SITE_CONFIG_CONTENT,
  PUBLIC_FAVICON,
  THEMES_DIR,
  THEMES_IMPORT_FILE,
} from './paths';
import packageJson from '../package.json';
import { promises as fs } from 'fs';
import path from 'path';

const appImportedPackages = packageJson.dependencies || {};
const appDevImportedPackages = packageJson.devDependencies || {};

const importedPackages = Object.keys({
  ...appImportedPackages,
  ...appDevImportedPackages,
});

// Define the theme names as constants for better maintainability
enum ThemeName {
  Default = 'default',
}
// Map of theme names to their package names
// This allows for easy extension if more themes are added in the future
const ThemePackagesMapping = new Map<string, string>([
  [ThemeName.Default, 'default'],
]);

function getThemePackageNameByThemeName(themeName: string) {
  return (
    ThemePackagesMapping.get(themeName) ||
    ThemePackagesMapping.get(ThemeName.Default)
  );
}

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

export interface NotFoundConfig {
  description: string;
  image: string;
  buttons: {
    text: string;
    href: string;
    type: 'link' | 'outline' | 'primary' | 'secondary' | 'ghost';
  }[];
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
  header: HeaderConfig;
  navigation?: NavigationConfig;
  footer?: FooterConfig;
  '404'?: NotFoundConfig;
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
    const unifiedConfig = await this.generateStaticConfig(config);
    await this.generateGlobalCss(unifiedConfig);
    await this.generateTheme(unifiedConfig);
    await this.copyFavicon(unifiedConfig);
    return unifiedConfig;
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
      '404': config['404'] as NotFoundConfig,
      ...config,
    };
  }

  private pathResolver(itemPath: string): string {
    if (itemPath.startsWith('http://') || itemPath.startsWith('https://')) {
      return itemPath; // External URL, no change needed
    }
    const baseSiteConfigPath = ORIGINAL_SITE_CONFIG_CONTENT;
    const baseDirName = path.dirname(baseSiteConfigPath);
    const itemPathResolved = path.join(baseDirName, itemPath);
    const relativePath = path.relative(baseDirName, itemPathResolved);

    return relativePath;
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

  private async generateStaticConfig(config: SiteConfig): Promise<SiteConfig> {
    const outputDir = GENERATED_OUTDIR;

    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    const staticConfig = this.recursivePathResolver({
      theme: config.theme,
      language: config.language,
      plugins: config.plugins,
      site: config.site,
      favicon: config.favicon,
      header: config.header,
      navigation: config.navigation,
      footer: config.footer,
      '404': config['404'],
    }) as unknown as SiteConfig;

    writeFileSync(this.outputPath, JSON.stringify(staticConfig, null, 2));
    console.log(
      '✅ Generated static site config at:',
      path.relative(process.cwd(), this.outputPath),
    );
    return staticConfig as SiteConfig;
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

@source "${ORIGINAL_CONTENT}";
@import '${config.theme}/styles/globals.css';

`;

    writeFileSync(globalCssPath, globalCssImports);
    console.log(
      '✅ Generated global CSS imports at:',
      path.relative(process.cwd(), globalCssPath),
    );
  }

  async getThemePackage(siteConfig: SiteConfig) {
    const dirs = await fs.readdir(THEMES_DIR, { withFileTypes: true });
    const selectedTheme = siteConfig.theme || 'default';
    const themeName = getThemePackageNameByThemeName(selectedTheme);
    let isFound = false;

    for (const dirent of dirs) {
      if (dirent.isDirectory()) {
        const themeDir = path.join(THEMES_DIR, dirent.name);
        const pkgJsonPath = path.join(themeDir, 'package.json');
        try {
          await fs.access(pkgJsonPath);
          const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'));
          const isContainedTheme = importedPackages.includes(pkgJson.name);
          if (isContainedTheme && pkgJson.name === themeName) {
            isFound = true;
            break;
          }
        } catch {
          // Not a theme package, skip
        }
      }
    }
    if (!isFound) {
      throw new Error(
        `Theme package "${themeName}" not found in ${THEMES_DIR}. Please ensure it is installed and has a valid package.json.`,
      );
    }

    return themeName;
  }

  generateImportSource(theme: string) {
    const fields = ['components', 'modules'];
    const exports = fields
      .map(field => {
        const importPath = `${theme}/${field}`;
        return `export * as THEME_${field.toUpperCase()} from '${importPath}';`;
      })
      .join('\n');

    return `// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated by the process-site-config script.

${exports}
`;
  }

  private async copyFavicon(siteConfig: SiteConfig): Promise<void> {
    if (siteConfig.favicon) {
      const absFaviconPath = path.resolve(
        path.dirname(ORIGINAL_SITE_CONFIG_CONTENT),
        siteConfig.favicon,
      );
      if (!existsSync(absFaviconPath)) {
        console.error(
          `❌ Favicon file not found at ${absFaviconPath}. Please check the path in site.json.`,
        );
        return;
      }
      await copyFile(absFaviconPath, PUBLIC_FAVICON);
      console.log(
        '✅ Copied favicon to:',
        path.relative(process.cwd(), PUBLIC_FAVICON),
      );
    }
  }

  // Script to generate the themes config file for the app
  // Scans themes/* for theme packages and generates a TypeScript config
  // Supports auto-select theme and auto-imports generated components to theme adapter
  async generateTheme(siteConfig: SiteConfig): Promise<void> {
    const theme = await this.getThemePackage(siteConfig);
    if (!theme) {
      throw new Error('No theme package found in themes/* directory.');
    }
    const configSource = this.generateImportSource(theme);
    await fs.mkdir(path.dirname(THEMES_IMPORT_FILE), { recursive: true });
    await fs.writeFile(THEMES_IMPORT_FILE, configSource, 'utf-8');
    console.log(
      `✅ Generated themes config at ${path.relative(process.cwd(), THEMES_IMPORT_FILE)}`,
    );
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
