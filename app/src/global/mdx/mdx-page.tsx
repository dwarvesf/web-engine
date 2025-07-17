import { MDXClient } from 'next-mdx-remote-client/csr';
import type { SerializeResult } from 'next-mdx-remote-client/serialize';
import React, { ComponentProps } from 'react';
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

function mdxRenderer(content?: MDXPageProps['mdxSource']) {
  if (!content || 'error' in content) {
    return null;
  }
  return (
    <MDXClient
      {...content}
      components={components}
      scope={{
        siteConfig,
      }}
    />
  );
}

function envPicker(
  keys: [
    string | undefined,
    keyof NonNullable<
      ComponentProps<NonNullable<typeof modules.TemplateRender>>['env']
    >,
  ][],
): Record<string, string | undefined> {
  return keys.reduce(
    (acc, [key, targetKey]) => {
      acc[targetKey] = key;
      return acc;
    },
    {} as Record<string, string | undefined>,
  );
}

export default function MDXPage({ frontmatter, mdxSource }: MDXPageProps) {
  const Component = modules?.TemplateRender ?? React.Fragment;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  const themeProps = // @ts-expect-error
    modules && modules.TemplateRender
      ? {
          siteConfig,
          frontmatter,
          mdxRenderer,
          env: envPicker([
            [process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 'GOOGLE_API'],
            [process.env.NEXT_PUBLIC_EMAILER_API, 'EMAILER_API'],
            [process.env.NEXT_PUBLIC_HUBSPOT_API, 'HUBSPOT_API'],
          ]),
        }
      : {};

  return (
    <Component
      {...(themeProps as ComponentProps<
        NonNullable<typeof modules.TemplateRender>
      >)}
    >
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
