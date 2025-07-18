import type { Element, Root as HastRoot } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Custom rehype plugin to add a class to internal links for Next.js router handling
 */
export function rehypeNextjsLinks() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'a' &&
        node.properties &&
        typeof node.properties.href === 'string'
      ) {
        const href = node.properties.href;

        // Check if the link is internal (doesn't start with a protocol or anchor)
        if (href && !/^(https?:\/\/|mailto:|tel:|#)/i.test(href)) {
          // Add the 'js-nextjs-link' class
          const existingClasses = Array.isArray(node.properties.className)
            ? node.properties.className
            : typeof node.properties.className === 'string'
              ? [node.properties.className]
              : [];
          node.properties.className = [...existingClasses, 'js-nextjs-link'];
        }
      }
    });
  };
}
