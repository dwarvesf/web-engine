import './setup-jsx';

import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';

import Heading, { H1, H2 } from '../../themes/default/components/ui/heading';
import Hero from '../../themes/default/components/hero';
import HeroTwo from '../../themes/default/components/hero-two';
import PartnerHero from '../../themes/default/components/partner-hero';

function classesOf(markup: string): string {
  return /class="([^"]*)"/.exec(markup)?.[1] ?? '';
}

function firstTag(markup: string): string {
  return /<(h[1-6])/.exec(markup)?.[1] ?? '';
}

test('Heading renders its level as the tag by default', () => {
  const markup = renderToStaticMarkup(<Heading level={1}>Title</Heading>);
  assert.equal(firstTag(markup), 'h1');
});

test('headingLevel changes the tag and nothing else', () => {
  const base = renderToStaticMarkup(<Heading level={1}>Title</Heading>);
  const demoted = renderToStaticMarkup(
    <Heading level={1} headingLevel={2}>
      Title
    </Heading>,
  );
  assert.equal(firstTag(base), 'h1');
  assert.equal(firstTag(demoted), 'h2');
  assert.equal(classesOf(demoted), classesOf(base));
  assert.match(demoted, />Title</);
});

test('a demoted level-1 heading does not look like a real h2', () => {
  const demoted = renderToStaticMarkup(
    <Heading level={1} headingLevel={2}>
      Title
    </Heading>,
  );
  const real = renderToStaticMarkup(<Heading level={2}>Title</Heading>);
  assert.notEqual(classesOf(demoted), classesOf(real));
  assert.match(classesOf(demoted), /lg:text-5xl/);
});

test('headingLevel does not leak into the DOM as an attribute', () => {
  const markup = renderToStaticMarkup(
    <Heading level={1} headingLevel={2}>
      Title
    </Heading>,
  );
  assert.doesNotMatch(markup, /headingLevel/i);
});

test('H1 forwards headingLevel, H2 is untouched', () => {
  assert.equal(firstTag(renderToStaticMarkup(<H1>Title</H1>)), 'h1');
  assert.equal(
    firstTag(renderToStaticMarkup(<H1 headingLevel={2}>Title</H1>)),
    'h2',
  );
  assert.equal(firstTag(renderToStaticMarkup(<H2>Title</H2>)), 'h2');
});

test('Hero renders h1 by default and h2 when demoted', () => {
  const base = renderToStaticMarkup(<Hero title="Empower Innovation" />);
  const demoted = renderToStaticMarkup(
    <Hero title="Empower Innovation" headingLevel={2} />,
  );
  assert.match(base, /<h1 class="([^"]*)">Empower Innovation<\/h1>/);
  assert.match(demoted, /<h2 class="([^"]*)">Empower Innovation<\/h2>/);
  const baseClasses = /<h1 class="([^"]*)"/.exec(base)?.[1];
  const demotedClasses = /<h2 class="([^"]*)"/.exec(demoted)?.[1];
  assert.equal(demotedClasses, baseClasses);
});

test('HeroTwo and PartnerHero keep their own classes when demoted', () => {
  for (const [base, demoted] of [
    [
      renderToStaticMarkup(<HeroTwo title="Open source" />),
      renderToStaticMarkup(<HeroTwo title="Open source" headingLevel={2} />),
    ],
    [
      renderToStaticMarkup(<PartnerHero title="Partner Network" />),
      renderToStaticMarkup(
        <PartnerHero title="Partner Network" headingLevel={2} />,
      ),
    ],
  ]) {
    assert.equal(firstTag(base), 'h1');
    assert.equal(firstTag(demoted), 'h2');
    assert.equal(
      /<h2 class="([^"]*)"/.exec(demoted)?.[1],
      /<h1 class="([^"]*)"/.exec(base)?.[1],
    );
  }
});
