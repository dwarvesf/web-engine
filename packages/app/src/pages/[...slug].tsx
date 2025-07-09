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
  return (
    <MDXPage
      frontmatter={frontmatter}
      mdxSource={mdxSource}
      className="min-h-screen"
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getContentMdxFilePaths();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[];
  if (!slug || slug.length === 0) {
    return { notFound: true };
  }

  const props = await getMdxContent(slug);
  if (!props || !props.mdxSource || 'error' in props.mdxSource) {
    return { notFound: true };
  }

  return {
    props,
  };
};
