import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@wse-themes/default'],
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  experimental: {
    mdxRs: false, // Use @next/mdx instead of experimental MDX support
    largePageDataBytes: 1024 * 1024,
  },
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
