import { GetStaticPaths, GetStaticProps } from 'next';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import {
  getContentMdxFilePaths,
  getMdxContent,
} from '@wse/global/utils/mdx-content';
import { MDXPage } from '@wse/global/mdx';

type DocPageProps = {
  frontmatter: Record<string, unknown>;
  mdxSource: Omit<SerializeResult, 'error'> & {
    compiledSource: string;
  };
};

export default function DocPage({ frontmatter, mdxSource }: DocPageProps) {
  return <MDXPage frontmatter={frontmatter} mdxSource={mdxSource} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getContentMdxFilePaths();
  // Combine all paths
  const excludePaths = ['index', 'INDEX', '_index', '_INDEX'];
  const allPaths = paths.filter(path => {
    const slug = path.params.slug.join('/');
    return !excludePaths.some(excludePath => slug.startsWith(excludePath));
  });

  // Deduplicate paths based on slug
  const uniquePaths = Array.from(
    new Map(
      allPaths.map(item => {
        const pathName = item.params.slug.join('/');
        const isIncludedExclude = excludePaths.some(excludePath =>
          pathName.endsWith(excludePath),
        );
        const removedExcludePath = isIncludedExclude
          ? pathName.replace(/(index|INDEX|_index|_INDEX)$/, '')
          : pathName;
        return [
          removedExcludePath,
          { params: { slug: removedExcludePath.split('/') } },
        ];
      }),
    ).values(),
  ) as {
    params: {
      slug: string[] | undefined; // Allow for index path
    };
  }[];
  // Add index path
  uniquePaths.unshift({ params: { slug: undefined } });
  return {
    paths: uniquePaths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[];

  const props = await getMdxContent(slug);
  if (!props || !props.mdxSource || 'error' in props.mdxSource) {
    return { notFound: true };
  }

  return {
    props,
  };
};
