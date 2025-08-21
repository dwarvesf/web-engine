import { PropsWithChildren } from 'react';
import { ConfigurationServiceName } from '../services/app-config';

type GroupItem = {
  group?: string;
  href?: string;
  tag?: string;
  pages?: (string | [string, string])[];
  groups?: GroupItem[];
};

export interface TabType {
  tab: string;
  href?: string;
  type?: string[] | string;
  tag?: string;
  groups?: GroupItem[];
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
  'opensource-navigation'?: NavigationConfig;
  'mobile-navigation-footer'?: {
    email?: string;
    socials?: SocialConfig;
  };
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

// Common frontmatter types
export interface BlogPost {
  title: string;
  excerpt?: string;
  href: string;
  date: string;
  author: string;
  category: string;
  readTime?: string;
  image?: string;
}

export interface Category {
  name: string;
  href: string;
  count: number;
}

export interface Tag {
  name: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface Service {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
  href?: string;
  price?: string;
  popular?: boolean;
}

export interface Process {
  title: string;
  description: string;
  step: number;
  icon?: React.ReactNode;
}

export interface Hero {
  title: string;
  description: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export interface CTA {
  title: string;
  description: string;
  action: { label: string; href: string };
}

export interface Frontmatter {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
  featuredPost?: BlogPost;
  categories?: Category[];
  tags?: Tag[];
  stats?: Stat[];
  features?: Feature[];
  testimonials?: Testimonial[];
  services?: Service[];
  process?: Process[];
  testimonial?: Testimonial;
  hero?: Hero;
  cta?: CTA;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type TemplateRenderArgs = PropsWithChildren<{
  frontmatter?: Frontmatter;
  siteConfig?: SiteConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mdxRenderer: (content: any) => React.ReactNode;
  env?: Record<ConfigurationServiceName, any>;
}>;

export enum ThemeTemplates {
  About = 'about',
  Work = 'work',
  Opensource = 'opensource',
  WorkDetail = 'work-detail',
  Services = 'services',
  Startup = 'startup',
  Five = 'five',
}
