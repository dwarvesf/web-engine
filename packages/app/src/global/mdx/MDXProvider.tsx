import { createContext, useContext, useEffect, useState } from 'react';
import { themeAdapter } from '../adapters';
import { getSiteConfig, SiteConfig } from '../config/site-config';

// Helper function to load all components from a theme
async function loadThemeComponents(themeName: string): Promise<MDXComponents> {
  try {
    // Use the theme adapter to load all components
    const themeComponents = await themeAdapter.loadAllThemeComponents();

    // Return a flat object with all components
    return {
      ...themeComponents,
      // Map HTML elements to theme components
      h1: themeComponents.H1,
      h2: themeComponents.H2,
      h3: themeComponents.H3,
      h4: themeComponents.H4,
      h5: themeComponents.H5,
      h6: themeComponents.H6,
      p: themeComponents.Paragraph,
      a: themeComponents.Link,
      img: themeComponents.Image,
      pre: themeComponents.CodeBlock,
      code: themeComponents.InlineCode,
      blockquote: themeComponents.Blockquote,
      ul: themeComponents.UnorderedList,
      ol: themeComponents.OrderedList,
      li: themeComponents.ListItem,
      table: themeComponents.Table,
      thead: themeComponents.TableHead,
      tbody: themeComponents.TableBody,
      tr: themeComponents.TableRow,
      th: themeComponents.TableHeader,
      td: themeComponents.TableCell,
    };
  } catch (error) {
    console.error(
      `Failed to load components from theme "${themeName}":`,
      error,
    );
    return {};
  }
}

export interface MDXComponents {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>;
}

interface MDXContextType {
  components: MDXComponents;
  theme: string;
  siteConfig: SiteConfig | null;
  loading: boolean;
}

const MDXContext = createContext<MDXContextType>({
  components: {},
  theme: 'default',
  siteConfig: null,
  loading: true,
});

export const useMDXContext = () => useContext(MDXContext);

interface MDXProviderProps {
  children: React.ReactNode;
}

export default function MDXProvider({ children }: MDXProviderProps) {
  const [components, setComponents] = useState<MDXComponents>({});
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('default');
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const config = getSiteConfig();
        setSiteConfig(config);
        setTheme(config.theme);

        // Load all components from the current theme
        const themeComponents = await loadThemeComponents(config.theme);
        setComponents(themeComponents);
      } catch (error) {
        console.error('Failed to load MDX components:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, []);

  const contextValue: MDXContextType = {
    components,
    theme,
    siteConfig,
    loading,
  };

  return (
    <MDXContext.Provider value={contextValue}>{children}</MDXContext.Provider>
  );
}
