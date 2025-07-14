// Layout component that wraps content with Header and Footer.
// Imports Header and Footer from the theme's organisms directory.

import React, { ReactNode } from 'react';
import { TemplateRenderArgs } from '../../types/theme';
import Footer from './footer';
import Header from './header';

export interface LayoutProps extends Pick<TemplateRenderArgs, 'siteConfig'> {
  children: ReactNode;
}

/**
 * Layout component for theme: includes Header, Footer, and main content area.
 */
const Layout: React.FC<LayoutProps> = ({ children, siteConfig }) => (
  <main className="dynamic-min-h-screen flex flex-col">
    <div className="border-box mx-auto flex w-full max-w-[1248px] flex-1 flex-grow flex-col px-2">
      <Header
        header={siteConfig?.header}
        navigation={siteConfig?.header?.navigation}
      />
      <div className="flex-grow py-2">{children}</div>
      <Footer footer={siteConfig?.footer} />
    </div>
  </main>
);

export default Layout;
