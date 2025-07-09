// Import the pre-generated theme CSS
import '../generated/globals.css';

import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import HotReload from '@wse/global/components/HotReload';
import { MDXProvider } from '@wse/global/mdx';
import { themeAdapter, getSiteConfig } from '@wse/global/adapters';

export default function App({ Component, pageProps }: AppProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      return;
    }
    const initializeApp = async () => {
      const siteConfig = getSiteConfig();

      themeAdapter.initializeFromConfig(siteConfig.theme);

      setIsInitialized(true);
    };

    initializeApp();
  }, [isInitialized]);

  return (
    <>
      {isInitialized ? (
        <MDXProvider>
          <Component {...pageProps} />
        </MDXProvider>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <div className="border-primary h-16 w-16 animate-spin rounded-full border-t-4"></div>
        </div>
      )}
      <HotReload />
    </>
  );
}
