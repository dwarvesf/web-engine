import { MDXClient } from 'next-mdx-remote-client/csr';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import React from 'react';
import { getSiteConfig, themeAdapter } from '../adapters';

interface MDXComponents {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>;
}

interface MDXPageProps {
  frontmatter: Record<string, unknown>;
  mdxSource: Omit<SerializeResult, 'error'> & {
    compiledSource: string;
  };
}

function loadThemeComponents(themeName: string): MDXComponents {
  try {
    // Use the theme adapter to load all components
    const themeComponents = themeAdapter.loadAllThemeComponents();

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
const siteConfig = getSiteConfig();
const components = loadThemeComponents(siteConfig?.theme || 'default');
const modules = themeAdapter.loadThemeModules();

export default function MDXPage({ frontmatter, mdxSource }: MDXPageProps) {
  const Component = modules?.TemplateRender ?? React.Fragment;

  return (
    <Component siteConfig={siteConfig!} frontmatter={frontmatter}>
      <MDXClient
        {...mdxSource}
        components={components}
        scope={{
          frontmatter,
          siteConfig,
        }}
      />
    </Component>
  );
}
