import { useEffect } from 'react';
import Layout from '../partials/layout';
import { TemplateRenderArgs } from '../../types/theme';

export default function FiveTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig } = props;
  useEffect(() => {
    let isDark = false;
    const html = document.documentElement;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (!isDark || html.getAttribute('data-theme') !== 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
      // If not dark mode, set the theme to dark and return to light mode on unmount
      return () => {
        html.removeAttribute('data-theme');
        html.classList.remove('dark');
      };
    }
  }, []);

  return <Layout siteConfig={siteConfig}>{children}</Layout>;
}
