/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote-client/serialize';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import {
  ASSET_POSSIBLE_EXTENSIONS,
  getRelativeImagePath,
  remarkTransformPaths,
} from '@wse/global/utils/mdx-processing/mdx-remarks/remark-transform-paths';
import { remarkMdxImports } from '@wse/global/utils/mdx-processing/mdx-remarks/remark-mdx-imports';
import recmaMdxEscapeMissingComponents from 'recma-mdx-escape-missing-components';
import { PUBLIC_CONTENT } from '../../../../scripts/paths';
import { getSiteConfig } from '@wse/global/adapters';
import remarkGfm from 'remark-gfm';
import { remarkUnwrapCustomBlocks } from '../mdx-processing/mdx-remarks/remark-unwrap-custom-blocks';
import { remarkLineBreaks } from '../mdx-processing/mdx-remarks/remark-break';
import { rehypeNextjsLinks } from '../mdx-processing/mdx-rehypes/rehype-mdx-next-link';

const getPlugins = (filePath: string) => [
  remarkGfm,
  remarkLineBreaks,
  remarkMdxImports,
  remarkUnwrapCustomBlocks, // Add the new plugin here
  () => remarkTransformPaths(filePath),
];

export function getAllMdxFiles(
  dir: string,
  basePath: string = '',
): Array<{ params: { slug: string[] } }> {
  const files = fs.readdirSync(dir);
  const paths: Array<{ params: { slug: string[] } }> = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively get files from subdirectories
      const subPaths = getAllMdxFiles(fullPath, path.join(basePath, file));
      paths.push(...subPaths);
    } else if (file.endsWith('.mdx')) {
      const fileName = file.replace(/\.mdx$/, '');
      const slugArray = basePath
        ? [...basePath.split('/'), fileName]
        : [fileName];
      paths.push({ params: { slug: slugArray } });
    }
  }

  return paths;
}

function recursiveResolveArrayPaths(
  arr: Array<string | number | Record<string, any>>,
  currentPath: string,
): Array<string | undefined | number | Record<string, any>> {
  return arr.map(item => {
    if (
      typeof item === 'string' &&
      ASSET_POSSIBLE_EXTENSIONS.some(ext => item.endsWith(ext))
    ) {
      return getRelativeImagePath(item, currentPath);
    } else if (Array.isArray(item)) {
      // If item is an array, recursively resolve paths in it
      return recursiveResolveArrayPaths(item, currentPath);
    } else if (typeof item === 'object' && item !== null) {
      // Recursively resolve paths in nested objects
      return resolveRecursiveFrontmatterRelativePath(item, currentPath);
    }
    return item; // Return as is if it's not a string or array
  });
}

function resolveRecursiveFrontmatterRelativePath(
  frontmatter: Record<string, any>,
  currentPath: string,
): Record<string, any> {
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    return frontmatter;
  }

  const resolvedFrontmatter: Record<string, any> = {};
  for (const key in frontmatter) {
    if (Object.prototype.hasOwnProperty.call(frontmatter, key)) {
      let value = frontmatter[key];
      if (typeof value === 'string') {
        // Check if the path has a valid asset extension
        if (ASSET_POSSIBLE_EXTENSIONS.some(ext => value.endsWith(ext))) {
          value = getRelativeImagePath(value, currentPath);
        }
      } else if (Array.isArray(value)) {
        value = recursiveResolveArrayPaths(value, currentPath);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively resolve paths in nested objects
        value = resolveRecursiveFrontmatterRelativePath(value, currentPath);
      }
      resolvedFrontmatter[key] = value;
    }
  }

  return resolvedFrontmatter;
}

export function getContentMdxFilePaths(): Array<{
  params: { slug: string[] };
}> {
  return getAllMdxFiles(PUBLIC_CONTENT);
}

export async function getFrontmatterMdxSerializedContent(
  data: Record<string, any> = {},
  filePath: string,
): Promise<Record<string, any>> {
  const frontmatter: Record<string, any> = {};
  if (!Object.keys(data).length) {
    return data;
  }
  const allowedKey = 'mdx-content';
  for (const key of Object.keys(data)) {
    if (
      data[key] &&
      typeof data[key] === 'string' &&
      key.endsWith(allowedKey)
    ) {
      // Serialize the MDX content
      const mdxSource = await serialize({
        source: data[key],
        options: {
          parseFrontmatter: false, // Frontmatter already parsed by gray-matter
          mdxOptions: {
            recmaPlugins: [recmaMdxEscapeMissingComponents],
            remarkPlugins: getPlugins(filePath), // Use the getPlugins function to get the plugins
            rehypePlugins: [rehypeNextjsLinks],
          },
          scope: {
            siteConfig: getSiteConfig(),
          },
        },
      });
      frontmatter[key] = mdxSource;
    } else {
      frontmatter[key] = data[key];
    }
  }
  return frontmatter;
}

export async function getMdxContent(slug: string[] | undefined): Promise<
  | {
      frontmatter: Record<string, any>;
      mdxSource: SerializeResult;
    }
  | undefined
> {
  let filePath: string = path.join(PUBLIC_CONTENT, ...(slug ?? [])) + '.mdx';
  if (!slug || !fs.existsSync(filePath)) {
    const filePaths = ['index', 'readme', '_index', '_readme']
      .map(file => [file, file.toUpperCase()])
      .flat();
    for (const fileName of filePaths) {
      const file =
        path.join(PUBLIC_CONTENT, ...(slug ?? []), fileName) + '.mdx';
      if (!fs.existsSync(file)) {
        continue;
      }
      filePath = file;
      break;
    }
    if (!filePath || !fs.existsSync(filePath)) {
      return;
    }
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  // Serialize the MDX content
  const mdxSource = await serialize({
    source: content,
    options: {
      parseFrontmatter: false, // Frontmatter already parsed by gray-matter
      mdxOptions: {
        recmaPlugins: [recmaMdxEscapeMissingComponents],
        remarkPlugins: getPlugins(filePath), // Use the getPlugins function to get the plugins
        rehypePlugins: [rehypeNextjsLinks],
      },
      scope: {
        siteConfig: getSiteConfig(),
      },
    },
  });

  return {
    frontmatter: await getFrontmatterMdxSerializedContent(
      resolveRecursiveFrontmatterRelativePath(data, filePath),
      filePath,
    ),
    mdxSource,
  };
}
