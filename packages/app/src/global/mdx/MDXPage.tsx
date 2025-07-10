import { MDXClient } from 'next-mdx-remote-client/csr';
import { useMDXContext } from './MDXProvider';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';

interface MDXPageProps {
  frontmatter: Record<string, unknown>;
  mdxSource: Omit<SerializeResult, 'error'> & {
    compiledSource: string;
  };
  className?: string;
}

export default function MDXPage({
  frontmatter,
  mdxSource,
  className = '',
}: MDXPageProps) {
  const { components, siteConfig } = useMDXContext();

  // Create enhanced components with site config integration
  const enhancedComponents = {
    ...components,
    // Navigation and Footer are automatically configured from site config
    Header: () => {
      const HeaderComponent = components.Header;
      if (!HeaderComponent || !siteConfig?.header) return null;

      return <HeaderComponent header={siteConfig?.header} />;
    },
    Footer: () => {
      const FooterComponent = components.Footer;
      if (!FooterComponent || !siteConfig?.footer) return null;

      return <FooterComponent footer={siteConfig?.footer} />;
    },
  };

  return (
    <div className={`mdx-page ${className}`}>
      <MDXClient
        {...mdxSource}
        components={enhancedComponents}
        scope={{
          frontmatter,
          siteConfig,
        }}
      />
    </div>
  );
}
