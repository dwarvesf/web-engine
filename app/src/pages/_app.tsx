// Import the pre-generated theme CSS
import '../generated/globals.css';

import type { AppProps } from 'next/app';
import HotReload from '@wse/global/components/hot-reload';
import SEO from '@wse/global/components/SEO';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SEO frontmatter={pageProps.frontmatter} />
      <Component {...pageProps} />
      <HotReload />
    </>
  );
}
