// Import the pre-generated theme CSS
import '../generated/globals.css';

import type { AppProps } from 'next/app';
import HotReload from '@wse/global/components/hot-reload';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
      </Head>
      <Component {...pageProps} />
      <HotReload />
    </>
  );
}
