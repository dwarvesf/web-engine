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
  );
  return {
    paths: uniquePaths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[];
  if (!slug || slug.length === 0) {
    return { notFound: true };
  }

  const props = await getMdxContent(slug);
  if (props?.mdxSource && !('error' in props.mdxSource)) {
    return { props };
  }

  const filePaths = ['index', 'readme', '_index', '_readme']
    .map(file => [file, file.toUpperCase()])
    .flat();
  let existedData: Awaited<ReturnType<typeof getMdxContent>> | null = null;
  for (const filePath of filePaths) {
    const props = await getMdxContent([...slug, filePath]);
    if (!props || !props.mdxSource || 'error' in props.mdxSource) {
      continue;
    }
    existedData = props;
    break;
  }

  if (!existedData) {
    return { notFound: true };
  }

  return {
    props: existedData,
  };
};
