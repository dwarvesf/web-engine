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
        // If the node is an MDX JSX flow element,
        // we want to "unwrap" its children from any auto-generated paragraphs.
        // This is a common pattern when MDX auto-wraps text in <p> tags.

        // Check if the immediate child is a paragraph and if it's the only child
        if (
          parent &&
          node.children &&
          node.children.length === 1 &&
          node.children[0].type === 'paragraph' &&
          parent.type === 'paragraph'
        ) {
          // Replace the paragraph node with its children
          node.children = (node.children[0] as Paragraph).children as (
            | BlockContent
            | DefinitionContent
          )[];
        }
      },
    );
  };
}
