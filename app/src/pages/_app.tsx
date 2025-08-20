// Import the pre-generated theme CSS
import '../generated/globals.css';

import type { AppProps } from 'next/app';
import HotReload from '@wse/global/components/hot-reload';
import SEO from '@wse/global/components/SEO';
import GlobalRouteHandler from '@wse/global/components/global-route-handler';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SEO frontmatter={pageProps.frontmatter} />
      <GlobalRouteHandler>
        <Component {...pageProps} />
      </GlobalRouteHandler>
      <HotReload />
    </>
  );
}
