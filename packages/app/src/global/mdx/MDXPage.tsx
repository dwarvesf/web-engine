import { MDXClient } from 'next-mdx-remote-client/csr';
import { useMDXContext } from './MDXProvider';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import { getComponentsForTemplate } from './MDXContent';

interface MDXPageProps {
  frontmatter: Record<string, any>;
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

  // Get template-specific components if template is specified
  const template = frontmatter?.template as string;
  const templateComponents = template
    ? getComponentsForTemplate(template, components)
    : {};

  // Create enhanced components with site config integration
  const enhancedComponents = {
    ...components,
    ...templateComponents,
    // Navigation and Footer are automatically configured from site config
    Header: () => {
      const NavigationComponent = components.Navigation;
      if (!NavigationComponent) return null;

      return (
        <NavigationComponent
          items={siteConfig?.navigation?.tabs || []}
          logoText={siteConfig?.site?.title}
        />
      );
    },
    Footer: () => {
      const FooterComponent = components.Footer;
      if (!FooterComponent) return null;

      return (
        <FooterComponent
          logoText={siteConfig?.site?.title}
          copyright={siteConfig?.footer?.global?.text}
          sections={siteConfig?.footer?.sections || []}
          socialLinks={transformSocialLinks(
            siteConfig?.footer?.global?.socials || {},
          )}
        />
      );
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

// Helper function to transform social links from site config format
function transformSocialLinks(
  socials: Record<string, string | [string, string] | [string, string, string]>,
) {
  return Object.entries(socials).map(([key, value]) => {
    if (typeof value === 'string') {
      return {
        name: key,
        href: value,
        icon: key.toLowerCase(),
      };
    }

    if (Array.isArray(value)) {
      return {
        name: value[2] || key,
        href: value[0],
        icon: value[1] || key.toLowerCase(),
      };
    }

    return {
      name: key,
      href: '#',
      icon: key.toLowerCase(),
    };
  });
}
