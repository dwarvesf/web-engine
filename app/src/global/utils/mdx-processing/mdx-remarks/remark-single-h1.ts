import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

/**
 * A document may render one `<h1>`. Several theme components own a page-title
 * heading, and a page that stacks four of them ships four `<h1>` elements and a
 * flat outline. This plugin keeps the first heading a document renders at level
 * 1 and demotes every later one to level 2 by setting `headingLevel` on the
 * component. Styling is unaffected: the components keep the level-1 classes and
 * change only the tag.
 *
 * Build time, not render time. The alternative, a React context that the first
 * heading claims, cannot survive a client-side navigation: the MDX subtree
 * remounts, and the claim is released after the new tree has already rendered.
 */

/** Whether a component renders its heading tag even with no `title`. */
type HeadingOwner = {
  /** The component renders the tag unconditionally. */
  always: boolean;
  /** Where the heading text comes from: a `title` prop, or the children. */
  text: 'title' | 'children';
};

/**
 * The default theme's heading-owning components. A theme that names its
 * components differently passes its own map to the plugin.
 */
export const DEFAULT_HEADING_OWNERS: Record<string, HeadingOwner> = {
  Hero: { always: true, text: 'title' },
  HeroTwo: { always: true, text: 'title' },
  PartnerHero: { always: true, text: 'title' },
  Dwarves: { always: true, text: 'title' },
  ColumnsList: { always: false, text: 'title' },
  ContentBoxes: { always: false, text: 'title' },
  H1: { always: true, text: 'children' },
};

const DEMOTED_LEVEL = 2;

function titleAttribute(node: MdxJsxFlowElement): MdxJsxAttribute | undefined {
  return node.attributes.find(
    (attribute): attribute is MdxJsxAttribute =>
      attribute.type === 'mdxJsxAttribute' && attribute.name === 'title',
  );
}

/** A `title` that is a non-empty string literal. An expression counts as text. */
function hasTitleText(node: MdxJsxFlowElement): boolean {
  const attribute = titleAttribute(node);
  if (!attribute) {
    return false;
  }
  if (typeof attribute.value === 'string') {
    return attribute.value.trim() !== '';
  }
  return attribute.value != null;
}

function hasHeadingText(node: MdxJsxFlowElement, owner: HeadingOwner): boolean {
  if (owner.text === 'children') {
    return node.children.length > 0;
  }
  return hasTitleText(node);
}

function rendersHeading(node: MdxJsxFlowElement, owner: HeadingOwner): boolean {
  return owner.always || titleAttribute(node) !== undefined;
}

/** `headingLevel={2}`, as the estree literal the MDX compiler expects. */
function demote(node: MdxJsxFlowElement) {
  const existing = node.attributes.find(
    attribute =>
      attribute.type === 'mdxJsxAttribute' && attribute.name === 'headingLevel',
  );
  if (existing) {
    return;
  }
  node.attributes.push({
    type: 'mdxJsxAttribute',
    name: 'headingLevel',
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: String(DEMOTED_LEVEL),
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          comments: [],
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Literal',
                value: DEMOTED_LEVEL,
                raw: String(DEMOTED_LEVEL),
              },
            },
          ],
        },
      },
    },
  });
}

/**
 * Rewrites a markdown `# heading` into the theme's own H1 component so it can
 * carry `headingLevel`. Lowering the mdast depth to 2 instead would map the
 * node to H2 and change how it looks, which is the one thing this plugin must
 * not do. The node is mutated in place, so the walk continues over the
 * rewritten element and the attribute guard makes the second pass a no-op.
 */
function rewriteMarkdownHeading(node: Node) {
  const heading = node as unknown as MdxJsxFlowElement & { depth?: number };
  heading.type = 'mdxJsxFlowElement';
  heading.name = 'H1';
  heading.attributes = [];
  delete heading.depth;
  demote(heading);
}

export function remarkSingleH1(
  owners: Record<string, HeadingOwner> = DEFAULT_HEADING_OWNERS,
) {
  return (tree: Node) => {
    let claimed = false;
    visit(tree, (node: Node) => {
      if (node.type === 'heading') {
        const heading = node as unknown as { depth: number; children: [] };
        if (heading.depth !== 1) {
          return;
        }
        if (!claimed && heading.children.length > 0) {
          claimed = true;
          return;
        }
        rewriteMarkdownHeading(node);
        return;
      }
      if (
        node.type !== 'mdxJsxFlowElement' &&
        node.type !== 'mdxJsxTextElement'
      ) {
        return;
      }
      const element = node as MdxJsxFlowElement;
      const owner = element.name ? owners[element.name] : undefined;
      if (!owner || !rendersHeading(element, owner)) {
        return;
      }
      // The first heading with actual text is the page title and keeps its tag.
      if (!claimed && hasHeadingText(element, owner)) {
        claimed = true;
        return;
      }
      demote(element);
    });
  };
}
