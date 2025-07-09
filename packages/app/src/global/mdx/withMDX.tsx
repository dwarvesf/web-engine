import { MDXContent } from './index';

interface WithMDXOptions {
  template?: string;
  components?: Record<string, React.ComponentType<any>>;
}

// Higher-order component to wrap MDX content with theme components
export function withMDX<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: WithMDXOptions = {},
) {
  return function MDXWrapper(props: T & { frontmatter?: Record<string, any> }) {
    const { frontmatter, ...componentProps } = props;

    return (
      <MDXContent
        frontmatter={frontmatter}
        template={options.template}
        components={options.components}
      >
        <Component {...(componentProps as T)} />
      </MDXContent>
    );
  };
}

// Hook to get MDX-ready components for use in pages
export function useMDXComponents() {
  return {
    // Re-export commonly used components for easy access
    withMDX,
    MDXContent,
  };
}
