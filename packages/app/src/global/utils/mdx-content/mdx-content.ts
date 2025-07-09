import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote-client/serialize';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import { remarkTransformPaths } from '@wse/global/utils/mdx-processing/mdx-remarks/remark-transform-paths';
import { remarkMdxImports } from '@wse/global/utils/mdx-processing/mdx-remarks/remark-mdx-imports';
import recmaMdxEscapeMissingComponents from 'recma-mdx-escape-missing-components';
import { PUBLIC_CONTENT } from '../../../../scripts/paths';

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

export function getContentMdxFilePaths(): Array<{
  params: { slug: string[] };
}> {
  return getAllMdxFiles(PUBLIC_CONTENT);
}

export async function getMdxContent(slug: string[]): Promise<
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      frontmatter: Record<string, any>;
      mdxSource: SerializeResult;
    }
  | undefined
> {
  const filePath = path.join(PUBLIC_CONTENT, ...slug) + '.mdx';
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return;
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
        remarkPlugins: [remarkMdxImports, () => remarkTransformPaths(filePath)], // Ensure order: imports first, then path transforms
      },
    },
  });

  return {
    frontmatter: data,
    mdxSource,
  };
}
