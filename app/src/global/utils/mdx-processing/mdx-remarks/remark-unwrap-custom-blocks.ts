import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Parent } from 'unist';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import type { Paragraph, BlockContent, DefinitionContent } from 'mdast';

export function remarkUnwrapCustomBlocks() {
  return (tree: Node) => {
    visit(
      tree,
      'mdxJsxFlowElement',
      (node: MdxJsxFlowElement, index, parent: Parent) => {
        const typesChecking = [node.name, parent.type];
        const whiteList = ['paragraph', 'anchor', 'button', 'p', 'a', 'link']
          .map(i => [i, i.slice(0, 1).toUpperCase() + i.slice(1)])
          .flat();
        // If the node is an MDX JSX flow element,
        // we want to "unwrap" its children from any auto-generated paragraphs.
        // This is a common pattern when MDX auto-wraps text in <p> tags.

        // Check if the immediate child is a paragraph and if it's the only child
        if (
          parent &&
          node.children &&
          node.children?.length === 1 &&
          whiteList.some(type => typesChecking.includes(type))
        ) {
          // Replace the paragraph node with its children
          node.children =
            ((node.children[0] as Paragraph).children as (
              | BlockContent
              | DefinitionContent
            )[]) ?? node.children;
        }
      },
    );
  };
}
