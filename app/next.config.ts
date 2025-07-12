import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_PAGES_BASE_PATH,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  experimental: {
    mdxRs: false, // Use @next/mdx instead of experimental MDX support
    largePageDataBytes: 1024 * 1024,
  },
  transpilePackages: ['default'],
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 120,
  webpack: config => {
    // Add string-replace-loader to handle basePath for anchor hrefs from libraries
    const basePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || '';

    if (basePath) {
      const normalizedBasePath = basePath.startsWith('/')
        ? basePath
        : `/${basePath}`;

      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: [/node_modules\/next\//, /\.next\//, /next\.config/],
        include: [/node_modules/, /themes/],
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                // Replace href="/path" with href="/basePath/path" (absolute paths starting with /)
                {
                  search: /href=["']\/(?!\/|[a-z-]+:)/,
                  replace: `href="${normalizedBasePath}/`,
                  flags: 'g',
                },
                // Replace href='#section' to href='#section' (keep anchors as is)
                {
                  search: /href=["']#([^"']*?)["']/,
                  replace: 'href="#$1"',
                  flags: 'g',
                },
                // Handle JSX href props: href="/path"
                {
                  search: /\bhref=\{["']\/(?!\/|[a-z-]+:)([^"']*?)["']\}/,
                  replace: `href={"${normalizedBasePath}/$1"}`,
                  flags: 'g',
                },
                // Handle template literals: href={`/path`}
                {
                  search: /\bhref=\{`\/(?!\/|[a-z-]+:)/,
                  replace: `href={\`${normalizedBasePath}/`,
                  flags: 'g',
                },
                // Handle dynamic variables: href={path} where path starts with "/"
                {
                  search: /\bhref=\{([a-zA-Z_$][a-zA-Z0-9_$.*]*)\}/g,
                  replace: `href={($1?.startsWith?.('/') && !$1?.startsWith?.('//') && !$1?.includes?.(':') && !$1?.startsWith?.('${normalizedBasePath}') ? '${normalizedBasePath}' + $1 : $1)}`,
                  flags: 'g',
                },
              ],
            },
          },
        ],
      });
    }

    return config;
  },
};

export default nextConfig;
