import React from 'react';
import Head from 'next/head';
import { getFileNameFromPath } from '../utils/misc';
import { getSiteConfig } from '../adapters';

const SITE_NAME = 'Dwarves Foundation';
const DEFAULT_TITLE =
  'Dwarves Foundation - We build software with Go, React, K8s, Swift and Flutter';
const DEFAULT_DESCRIPTION =
  'A software development firm based in Asia. Helping tech startups, entrepreneurs and makers build world-class products since 2013.';
const DEFAULT_WEBSITE_URL = 'https://d.foundation';
const DEFAULT_THUMBNAIL = '/thumbnail.jpg';
const DEFAULT_KEYWORDS = [
  'dwarves',
  'dwarves foundation',
  'cloud',
  'cloud platforms',
  'golang',
  'go',
  'docker',
  'k8s',
  'scale',
  'tech',
  'startups',
  'opensource',
  'open source',
].join(',');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SEO: React.FC<{ frontmatter: Record<string, any> }> = ({
  frontmatter = {},
}) => {
  const title = frontmatter.title;
  const description = frontmatter.description || DEFAULT_DESCRIPTION;
  const ogURL = frontmatter['og:url'] || DEFAULT_WEBSITE_URL;
  const templateThumbnail = frontmatter.thumbnail;
  const keywords = frontmatter.keywords || DEFAULT_KEYWORDS;
  const thumbnailImage =
    templateThumbnail ||
    getFileNameFromPath(getSiteConfig()?.thumbnail || DEFAULT_THUMBNAIL);
  const pageTitle = title ? `${title} - ${SITE_NAME}` : DEFAULT_TITLE;
  const thumbnailPath = `${ogURL}${thumbnailImage}`;

  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return DEFAULT_WEBSITE_URL;
  };

  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
      />
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {/* SEO markups */}
      <meta property="ia:markup_url" content={getCurrentUrl()} />
      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="en-US" />
      <meta property="og:url" content={ogURL} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={thumbnailPath} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@dwarvesf" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={thumbnailPath} />
    </Head>
  );
};

export default SEO;
