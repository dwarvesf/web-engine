import { Html, Head, Main, NextScript } from 'next/document';

function getAssetPath(path: string): string {
  const basePath = (() => {
    const basePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || '';
    if (!basePath) {
      return '';
    }
    // Ensure the base path starts with a slash
    return basePath.startsWith('/') ? basePath : `/${basePath}`;
  })();

  return `/${[basePath, path].join('/')}`.replace(/\/+/g, '/');
}

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <Head>
        <link rel="icon" href={getAssetPath('favicon.ico')} />
        <link
          rel="apple-touch-icon"
          href={getAssetPath('apple-touch-icon.png')}
        />
        {/* Fonts preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
