import { GetStaticProps } from 'next';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import { getMdxContent } from '@wse/global/utils/mdx-content';
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

export const getStaticProps: GetStaticProps = async () => {
  const filePaths = ['index', 'readme', '_index', '_readme']
    .map(file => [file, file.toUpperCase()])
    .flat();
  let existedData: Awaited<ReturnType<typeof getMdxContent>> | null = null;
  for (const filePath of filePaths) {
    const props = await getMdxContent([filePath]);
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
