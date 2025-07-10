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
    <Header header={siteConfig?.header} />
    {children}
    <Footer footer={siteConfig?.footer} />
  </main>
);

export default Layout;
