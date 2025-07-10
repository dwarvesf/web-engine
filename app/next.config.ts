import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.PAGES_BASE_PATH,
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
};

export default nextConfig;
