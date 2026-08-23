import assert from 'node:assert/strict';
import test from 'node:test';

import worker, { __test__ } from '../worker/_worker.js';

const { acceptQuality, notFoundMarkdown, prefersTextBody } = __test__;

const ORIGIN = 'https://example.test';
const BROWSER_ACCEPT =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8';
const BROWSER_UA = 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36';

/**
 * A stand-in for the Pages assets binding. `files` maps a pathname to a body
 * plus content type; anything absent answers the way Pages answers a miss,
 * with the styled 404 document at status 404.
 */
function assetsFrom(files) {
  const calls = [];
  return {
    calls,
    fetch(input) {
      const url = new URL(typeof input === 'string' ? input : input.url);
      calls.push(url.pathname);
      const file = files[url.pathname];
      if (file) {
        return Promise.resolve(
          new Response(file.body, {
            status: file.status ?? 200,
            headers: { 'content-type': file.type, ...(file.headers ?? {}) },
          }),
        );
      }
      const styled = files['/404.html'];
      return Promise.resolve(
        new Response(styled ? styled.body : null, {
          status: 404,
          headers: styled ? { 'content-type': styled.type } : {},
        }),
      );
    },
  };
}

const SITE = {
  '/index.html': {
    body: '<html>home</html>',
    type: 'text/html; charset=utf-8',
  },
  '/about/index.html': {
    body: '<html>about</html>',
    type: 'text/html; charset=utf-8',
  },
  '/404.html': {
    body: '<html>styled 404</html>',
    type: 'text/html; charset=utf-8',
  },
  '/sitemap.xml': { body: '<urlset/>', type: 'application/xml' },
  '/content/images/logo.svg': { body: '<svg/>', type: 'image/svg+xml' },
};

/** Pages resolves /about/ to /about/index.html; the double serves that too. */
function siteAssets() {
  const files = { ...SITE };
  for (const [pathname, file] of Object.entries(SITE)) {
    if (pathname.endsWith('/index.html')) {
      files[pathname.replace(/index\.html$/, '')] = file;
    }
  }
  return assetsFrom(files);
}

function call(pathname, { accept, ua, method = 'GET', assets } = {}) {
  const env = { ASSETS: assets ?? siteAssets() };
  const headers = {};
  if (accept !== undefined) headers.accept = accept;
  if (ua !== undefined) headers['user-agent'] = ua;
  const request = new Request(new URL(pathname, ORIGIN), { method, headers });
  return worker.fetch(request, env).then(response => ({ response, env }));
}

test('acceptQuality reads a q-value and ignores a wildcard range', () => {
  assert.equal(acceptQuality('text/markdown', 'text/markdown'), 1);
  assert.equal(acceptQuality('text/markdown;q=0.4', 'text/markdown'), 0.4);
  assert.equal(acceptQuality('*/*', 'text/markdown'), -1);
  assert.equal(acceptQuality('', 'text/markdown'), -1);
  assert.equal(
    acceptQuality('text/html, text/markdown;q=0.5', 'text/markdown'),
    0.5,
  );
});

test('prefersTextBody accepts any mention of markdown or plain text', () => {
  assert.equal(
    prefersTextBody(
      new Request(ORIGIN, { headers: { accept: 'text/markdown' } }),
    ),
    true,
  );
  assert.equal(
    prefersTextBody(new Request(ORIGIN, { headers: { accept: 'text/plain' } })),
    true,
  );
  assert.equal(
    prefersTextBody(
      new Request(ORIGIN, {
        headers: { accept: 'text/html, text/markdown;q=0.1' },
      }),
    ),
    true,
  );
});

test('prefersTextBody keeps HTML for a browser and takes text for curl', () => {
  assert.equal(prefersTextBody(new Request(ORIGIN)), true);
  assert.equal(
    prefersTextBody(new Request(ORIGIN, { headers: { accept: '*/*' } })),
    true,
  );
  assert.equal(
    prefersTextBody(
      new Request(ORIGIN, {
        headers: { accept: '*/*', 'user-agent': BROWSER_UA },
      }),
    ),
    false,
  );
  assert.equal(
    prefersTextBody(
      new Request(ORIGIN, { headers: { accept: BROWSER_ACCEPT } }),
    ),
    false,
  );
});

test('an unknown path answers the styled 404 to a browser', async () => {
  const { response } = await call('/nope', {
    accept: BROWSER_ACCEPT,
    ua: BROWSER_UA,
  });
  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.equal(response.headers.get('vary'), 'accept');
  assert.equal(await response.text(), '<html>styled 404</html>');
});

test('an unknown path answers a markdown body to a text client', async () => {
  const { response } = await call('/nope', { accept: 'text/markdown' });
  assert.equal(response.status, 404);
  assert.equal(
    response.headers.get('content-type'),
    'text/markdown; charset=utf-8',
  );
  assert.equal(response.headers.get('vary'), 'accept');
  const body = await response.text();
  assert.match(body, /^# 404 Not Found/);
  assert.match(body, /https:\/\/example\.test\/sitemap\.xml/);
  assert.match(body, /https:\/\/example\.test\/llms\.txt/);
});

test('a curl-shaped 404 gets the markdown body', async () => {
  const { response } = await call('/nope');
  assert.equal(response.status, 404);
  assert.equal(
    response.headers.get('content-type'),
    'text/markdown; charset=utf-8',
  );
});

test('a text/plain 404 gets the markdown body', async () => {
  const { response } = await call('/nope', { accept: 'text/plain' });
  assert.equal(response.status, 404);
  assert.equal(
    response.headers.get('content-type'),
    'text/markdown; charset=utf-8',
  );
});

test('a missing asset also gets the agent 404', async () => {
  const { response } = await call('/content/images/missing.png', {
    accept: 'text/markdown',
  });
  assert.equal(response.status, 404);
  assert.match(await response.text(), /^# 404 Not Found/);
});

test('a 404 with no styled document falls back to the markdown body', async () => {
  const { response } = await call('/nope', {
    accept: BROWSER_ACCEPT,
    ua: BROWSER_UA,
    assets: assetsFrom({}),
  });
  assert.equal(response.status, 404);
  assert.equal(
    response.headers.get('content-type'),
    'text/markdown; charset=utf-8',
  );
});

test('the 404 body names the requesting origin, not a fixed host', () => {
  assert.match(
    notFoundMarkdown('https://other.example'),
    /https:\/\/other\.example\//,
  );
});

test('a real page is passed through untouched, whatever the Accept', async () => {
  for (const accept of [BROWSER_ACCEPT, 'text/markdown', '*/*']) {
    const { response, env } = await call('/about/', { accept });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(response.headers.get('vary'), null);
    assert.equal(await response.text(), '<html>about</html>');
    assert.deepEqual(env.ASSETS.calls, ['/about/']);
  }
});

test('an asset is passed through untouched', async () => {
  const { response, env } = await call('/content/images/logo.svg', {
    accept: 'text/markdown',
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/svg+xml');
  assert.equal(response.headers.get('vary'), null);
  assert.deepEqual(env.ASSETS.calls, ['/content/images/logo.svg']);
});

test('a redirect from the assets layer is passed through', async () => {
  const assets = assetsFrom({
    '/about': {
      body: null,
      status: 308,
      type: 'text/plain',
      headers: { location: '/about/' },
    },
  });
  const { response } = await call('/about', {
    accept: 'text/markdown',
    assets,
  });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), '/about/');
  assert.deepEqual(assets.calls, ['/about']);
});
