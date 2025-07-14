// Layout component that wraps content with Header and Footer.
// Imports Header and Footer from the theme's organisms directory.

import React, { ComponentProps, ReactNode } from 'react';
import { TemplateRenderArgs } from '../../types/theme';
import Footer from './footer';
import Header from './header';
import { cn } from '../../utils';

export interface LayoutProps extends Pick<TemplateRenderArgs, 'siteConfig'> {
  children: ReactNode;
  headerProps?: ComponentProps<typeof Header>;
  footerProps?: ComponentProps<typeof Footer>;
  contentClassName?: string;
}

/**
 * Layout component for theme: includes Header, Footer, and main content area.
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  siteConfig,
  headerProps,
  footerProps,
  contentClassName,
}) => (
  <main className="dynamic-min-h-screen flex flex-col">
    <Header
      header={siteConfig?.header}
      navigation={siteConfig?.header?.navigation}
      {...headerProps}
    />
    <div className={cn('flex-grow py-2', contentClassName)}>{children}</div>
    <Footer footer={siteConfig?.footer} {...footerProps} />
  </main>
);

export default Layout;
