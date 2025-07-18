import { visit } from 'unist-util-visit';
import type { Literal, Root } from 'mdast';

export function remarkLineBreaks() {
  return (tree: Root) => {
    visit(tree, 'html', (node: Literal) => {
      if (typeof node.value === 'string') {
        if (
          node.value.toLowerCase() === '<br>' ||
          node.value.toLowerCase() === '<br/>'
        ) {
          node.type = 'break';
        }
      }
    });
  };
}
