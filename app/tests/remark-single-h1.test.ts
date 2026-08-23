import assert from 'node:assert/strict';
import test from 'node:test';
import { remarkSingleH1 } from '../src/global/utils/mdx-processing/mdx-remarks/remark-single-h1';

type Attribute = {
  type: string;
  name?: string;
  value?: unknown;
};

type Element = {
  type: string;
  name: string | null;
  attributes: Attribute[];
  children: unknown[];
};

function element(
  name: string | null,
  attributes: Record<string, string> = {},
  children: unknown[] = [],
): Element {
  return {
    type: 'mdxJsxFlowElement',
    name,
    attributes: Object.entries(attributes).map(([key, value]) => ({
      type: 'mdxJsxAttribute',
      name: key,
      value,
    })),
    children,
  };
}

function run(children: unknown[]) {
  const tree = { type: 'root', children };
  remarkSingleH1()(tree as never);
  return tree;
}

function levelOf(node: Element): number | undefined {
  const attribute = node.attributes.find(a => a.name === 'headingLevel');
  if (!attribute) {
    return undefined;
  }
  const value = attribute.value;
  return Number(
    typeof value === 'string' ? value : (value as { value?: string }).value,
  );
}

test('the first heading owner keeps level 1, the rest are demoted', () => {
  const heroes = [
    element('Hero', { title: 'Empower Innovation' }),
    element('Hero', { title: 'It is the details that count' }),
    element('Hero', { title: 'Successful outcomes' }),
    element('Hero', { title: 'Area of services' }),
  ];
  run(heroes);
  assert.equal(levelOf(heroes[0]), undefined);
  assert.deepEqual(heroes.slice(1).map(levelOf), [2, 2, 2]);
});

test('a component that is not a heading owner is left alone', () => {
  const nodes = [element('Section', { title: 'Not a heading' })];
  run(nodes);
  assert.equal(levelOf(nodes[0]), undefined);
  assert.equal(nodes[0].attributes.length, 1);
});

test('a titleless owner that renders no heading does not claim the h1', () => {
  const nodes = [
    element('ColumnsList'),
    element('Hero', { title: 'The page title' }),
  ];
  run(nodes);
  assert.equal(levelOf(nodes[0]), undefined);
  assert.equal(levelOf(nodes[1]), undefined);
});

test('a titleless Hero renders an empty heading, so it is demoted', () => {
  const nodes = [element('Hero'), element('Hero', { title: 'The page title' })];
  run(nodes);
  assert.equal(levelOf(nodes[0]), 2);
  assert.equal(levelOf(nodes[1]), undefined);
});

test('an empty title does not claim the h1 either', () => {
  const nodes = [
    element('Hero', { title: '   ' }),
    element('Hero', { title: 'The page title' }),
  ];
  run(nodes);
  assert.equal(levelOf(nodes[0]), 2);
  assert.equal(levelOf(nodes[1]), undefined);
});

test('H1 claims through its children, not a title prop', () => {
  const nodes = [
    element('H1', {}, [{ type: 'text', value: 'The page title' }]),
    element('Hero', { title: 'A section' }),
  ];
  run(nodes);
  assert.equal(levelOf(nodes[0]), undefined);
  assert.equal(levelOf(nodes[1]), 2);
});

test('a nested owner is demoted in document order', () => {
  const nested = element('H1', {}, [{ type: 'text', value: 'Nested' }]);
  const nodes = [element('Hero', { title: 'The page title' }, [nested])];
  run(nodes);
  assert.equal(levelOf(nodes[0]), undefined);
  assert.equal(levelOf(nested), 2);
});

test('an existing headingLevel is not overwritten', () => {
  const nodes = [
    element('Hero', { title: 'The page title' }),
    element('Hero', { title: 'Pinned', headingLevel: '3' }),
  ];
  run(nodes);
  assert.equal(
    nodes[1].attributes.filter(a => a.name === 'headingLevel').length,
    1,
  );
  assert.equal(levelOf(nodes[1]), 3);
});

test('the demoted attribute carries an estree literal the compiler can read', () => {
  const nodes = [
    element('Hero', { title: 'The page title' }),
    element('Hero', { title: 'A section' }),
  ];
  run(nodes);
  const attribute = nodes[1].attributes.find(a => a.name === 'headingLevel');
  const value = attribute?.value as {
    type: string;
    data: { estree: { body: { expression: { value: number } }[] } };
  };
  assert.equal(value.type, 'mdxJsxAttributeValueExpression');
  assert.equal(value.data.estree.body[0].expression.value, 2);
});

test('a caller can name its own heading owners', () => {
  const nodes = [
    element('Banner', { title: 'First' }),
    element('Banner', { title: 'Second' }),
    element('Hero', { title: 'Not an owner here' }),
  ];
  const tree = { type: 'root', children: nodes };
  remarkSingleH1({ Banner: { always: true, text: 'title' } })(tree as never);
  assert.equal(levelOf(nodes[0]), undefined);
  assert.equal(levelOf(nodes[1]), 2);
  assert.equal(levelOf(nodes[2]), undefined);
});

function markdownHeading(depth: number, text: string) {
  return { type: 'heading', depth, children: [{ type: 'text', value: text }] };
}

test('the first markdown # heading claims the h1 and stays a heading', () => {
  const nodes = [markdownHeading(1, 'The page title')];
  run(nodes);
  assert.equal(nodes[0].type, 'heading');
  assert.equal(nodes[0].depth, 1);
});

test('a later markdown # heading becomes a demoted H1 component', () => {
  const nodes = [
    element('Hero', { title: 'The page title' }),
    markdownHeading(1, 'How it works'),
  ] as never[];
  run(nodes);
  const rewritten = nodes[1] as unknown as Element & { depth?: number };
  assert.equal(rewritten.type, 'mdxJsxFlowElement');
  assert.equal(rewritten.name, 'H1');
  assert.equal(rewritten.depth, undefined);
  assert.equal(levelOf(rewritten), 2);
  assert.deepEqual(rewritten.children, [
    { type: 'text', value: 'How it works' },
  ]);
});

test('markdown headings below level 1 are untouched', () => {
  const nodes = [
    element('Hero', { title: 'The page title' }),
    markdownHeading(2, 'A section'),
    markdownHeading(3, 'A subsection'),
  ] as never[];
  run(nodes);
  assert.equal((nodes[1] as { type: string }).type, 'heading');
  assert.equal((nodes[2] as { type: string }).type, 'heading');
});

test('each document gets its own h1 claim', () => {
  const first = [element('Hero', { title: 'Page one' })];
  const second = [element('Hero', { title: 'Page two' })];
  run(first);
  run(second);
  assert.equal(levelOf(first[0]), undefined);
  assert.equal(levelOf(second[0]), undefined);
});
