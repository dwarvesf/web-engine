import { createContext, useContext, useEffect, useState } from 'react';
import { themeAdapter } from '../adapters';
import { getSiteConfig, SiteConfig } from '../config/site-config';

export interface MDXComponents {
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
  const [siteConfig, setSiteConfig] = useState<any>(null);

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

// Helper function to load all components from a theme
async function loadThemeComponents(themeName: string): Promise<MDXComponents> {
  try {
    // Use the theme adapter to load all components
    const themeComponents =
      await themeAdapter.loadAllThemeComponents(themeName);

    // Return a flat object with all components
    return {
      ...themeComponents,
      // Map HTML elements to theme components
      h1: themeComponents.H1 as any,
      h2: themeComponents.H2 as any,
      h3: themeComponents.H3 as any,
      h4: themeComponents.H4 as any,
      h5: themeComponents.H5 as any,
      h6: themeComponents.H6 as any,
      p: themeComponents.Paragraph as any,
      a: themeComponents.Link as any,
      img: themeComponents.Image as any,
      pre: themeComponents.CodeBlock as any,
      code: themeComponents.InlineCode as any,
      blockquote: themeComponents.Blockquote as any,
      ul: themeComponents.UnorderedList as any,
      ol: themeComponents.OrderedList as any,
      li: themeComponents.ListItem as any,
      table: themeComponents.Table as any,
      thead: themeComponents.TableHead as any,
      tbody: themeComponents.TableBody as any,
      tr: themeComponents.TableRow as any,
      th: themeComponents.TableHeader as any,
      td: themeComponents.TableCell as any,
    };
  } catch (error) {
    console.error(
      `Failed to load components from theme "${themeName}":`,
      error,
    );
    return {};
  }
}
