import { PropsWithChildren } from 'react';

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

export type TemplateRenderArgs = PropsWithChildren<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter?: Record<string, any>;
  siteConfig?: SiteConfig;
}>;

export enum ThemeTemplates {
  About = 'about',
  Work = 'work',
}
