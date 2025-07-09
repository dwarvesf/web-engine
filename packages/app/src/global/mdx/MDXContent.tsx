import React, { useEffect, useState } from 'react';
import MDXRenderer from './MDXRenderer';
import { themeAdapter } from '../adapters/theme-adapter';

interface MDXContentProps {
  children: React.ReactNode;
  frontmatter?: Record<string, unknown>;
  components?: Record<string, React.ComponentType<any>>;
  template?: string;
}

export default function MDXContent({
  children,
  components = {},
  template,
}: MDXContentProps) {
  const [enhancedComponents, setEnhancedComponents] =
    useState<Record<string, React.ComponentType<any>>>(components);

  useEffect(() => {
    async function loadTemplateComponents() {
      if (template) {
        const templateComponents = await getTemplateComponents(template);
        setEnhancedComponents({
          ...components,
          ...templateComponents,
        });
      }
    }

    loadTemplateComponents();
  }, [template, components]);

  return (
    <MDXRenderer components={enhancedComponents}>
      <div className="mdx-content">{children}</div>
    </MDXRenderer>
  );
}

// Helper function to get template-specific components
async function getTemplateComponents(template: string) {
  const themeComponents = await themeAdapter.loadAllThemeComponents();

  const filterUndefined = (
    components: Record<string, unknown>,
  ): Record<string, React.ComponentType<any>> => {
    return Object.fromEntries(
      Object.entries(components).filter(
        ([, component]) => component !== undefined,
      ),
    ) as Record<string, React.ComponentType<any>>;
  };

  switch (template) {
    case 'work-template':
      return filterUndefined({
        Hero: themeComponents.Hero,
        WorkCard: themeComponents.WorkCard,
        Tag: themeComponents.Tag,
        Button: themeComponents.Button,
      });
    case 'home-template':
      return filterUndefined({
        Hero: themeComponents.Hero,
        ServiceCard: themeComponents.ServiceCard,
        ClientShowcase: themeComponents.ClientShowcase,
        WorkCard: themeComponents.WorkCard,
        Button: themeComponents.Button,
      });
    case 'about-template':
      return filterUndefined({
        Hero: themeComponents.Hero,
        ClientShowcase: themeComponents.ClientShowcase,
        Icon: themeComponents.Icon,
      });
    default:
      return {};
  }
}

// Export synchronous version for direct use
export function getComponentsForTemplate(
  template: string,
  themeComponents: Record<string, React.ComponentType<any>>,
): Record<string, React.ComponentType<any>> {
  const filterUndefined = (
    components: Record<string, unknown>,
  ): Record<string, React.ComponentType<any>> => {
    return Object.fromEntries(
      Object.entries(components).filter(
        ([, component]) => component !== undefined,
      ),
    ) as Record<string, React.ComponentType<any>>;
  };

  switch (template) {
    case 'work-template':
      return filterUndefined({
        Hero: themeComponents.Hero,
        WorkCard: themeComponents.WorkCard,
        Tag: themeComponents.Tag,
        Button: themeComponents.Button,
      });
    case 'home-template':
      return filterUndefined({
        Hero: themeComponents.Hero,
        ServiceCard: themeComponents.ServiceCard,
        ClientShowcase: themeComponents.ClientShowcase,
        WorkCard: themeComponents.WorkCard,
        Button: themeComponents.Button,
      });
    case 'about-template':
      return filterUndefined({
        Hero: themeComponents.Hero,
        ClientShowcase: themeComponents.ClientShowcase,
        Icon: themeComponents.Icon,
      });
    default:
      return {};
  }
}
