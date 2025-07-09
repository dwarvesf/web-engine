import { MDXProvider } from 'next-mdx-remote-client/csr';
import { useMDXContext } from './MDXProvider';

interface MDXRendererProps {
  children: React.ReactNode;
  components?: Record<string, React.ComponentType<any>>;
}

export default function MDXRenderer({
  children,
  components: customComponents = {},
}: MDXRendererProps) {
  const { components: themeComponents, loading, siteConfig } = useMDXContext();

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-t-2"></div>
      </div>
    );
  }

  // Merge theme components with custom components (custom components take precedence)
  const mergedComponents = {
    ...themeComponents,
    ...customComponents,
  };

  // Add site config to components for dynamic rendering
  const componentsWithConfig = {
    ...mergedComponents,
    // Pass site config to components that need it
    Navigation: (props: any) => {
      const NavigationComponent = themeComponents.Navigation;
      if (!NavigationComponent) return null;

      return (
        <NavigationComponent
          {...props}
          items={siteConfig?.navigation?.tabs || []}
          logoText={siteConfig?.site?.title}
        />
      );
    },
    Footer: (props: any) => {
      const FooterComponent = themeComponents.Footer;
      if (!FooterComponent) return null;

      return (
        <FooterComponent
          {...props}
          logoText={siteConfig?.site?.title}
          copyright={siteConfig?.footer?.global?.text}
          sections={siteConfig?.footer?.sections || []}
          socialLinks={transformSocialLinks(
            siteConfig?.footer?.global?.socials || {},
          )}
        />
      );
    },
    ClientShowcase: (props: any) => {
      const ClientShowcaseComponent = themeComponents.ClientShowcase;
      if (!ClientShowcaseComponent) return null;

      return <ClientShowcaseComponent {...props} />;
    },
  };

  return (
    <MDXProvider components={componentsWithConfig}>{children}</MDXProvider>
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
        icon: key.toLowerCase(), // Assume icon name matches social platform
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
