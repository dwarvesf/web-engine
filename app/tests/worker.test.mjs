import assert from 'node:assert/strict';
import test from 'node:test';

import worker, { __test__ } from '../worker/_worker.js';

const {
  acceptQuality,
  notFoundMarkdown,
  pageRoute,
  prefersMarkdownPage,
  prefersTextBody,
  withVaryAccept,
} = __test__;

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
            status: 200,
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
  '/index.md': {
    body: '# Home\n',
    type: 'text/markdown',
    headers: { etag: '"home-etag"', 'cache-control': 'public, max-age=0' },
  },
  '/about/index.html': {
    body: '<html>about</html>',
    type: 'text/html; charset=utf-8',
  },
  '/about/index.md': { body: '# About\n', type: 'text/markdown' },
  '/work/index.html': {
    body: '<html>work</html>',
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

test('prefersMarkdownPage needs markdown named and ranked above html', () => {
  assert.equal(prefersMarkdownPage('text/markdown'), true);
  assert.equal(
    prefersMarkdownPage('text/markdown;q=0.9, text/html;q=0.8'),
    true,
  );
  assert.equal(prefersMarkdownPage('text/html, text/markdown;q=0.5'), false);
  assert.equal(prefersMarkdownPage('*/*'), false);
  assert.equal(prefersMarkdownPage(BROWSER_ACCEPT), false);
  assert.equal(prefersMarkdownPage('text/markdown;q=0'), false);
});

test('prefersTextBody is looser than the page rule', () => {
  assert.equal(prefersTextBody(new Request(ORIGIN)), true);
  assert.equal(
    prefersTextBody(
      new Request(ORIGIN, {
        headers: { accept: '*/*', 'user-agent': BROWSER_UA },
      }),
    ),
    false,
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
  assert.equal(
    prefersTextBody(
      new Request(ORIGIN, { headers: { accept: BROWSER_ACCEPT } }),
    ),
    false,
  );
});

test('pageRoute names routes and rejects files and reserved prefixes', () => {
  assert.equal(pageRoute('/'), '');
  assert.equal(pageRoute('/about/'), '/about');
  assert.equal(pageRoute('/about'), '/about');
  assert.equal(pageRoute('/sitemap.xml'), null);
  assert.equal(pageRoute('/llms.txt'), null);
  assert.equal(pageRoute('/_next/static/chunk.js'), null);
  assert.equal(pageRoute('/content/images/logo.svg'), null);
  assert.equal(pageRoute('/content'), null);
});

test('withVaryAccept compares tokens, not substrings', () => {
  const encoded = withVaryAccept(
    new Response('x', { headers: { vary: 'Accept-Encoding' } }),
  );
  assert.equal(encoded.headers.get('vary'), 'Accept-Encoding, accept');

  const already = withVaryAccept(
    new Response('x', { headers: { vary: 'Accept-Encoding, Accept' } }),
  );
  assert.equal(already.headers.get('vary'), 'Accept-Encoding, Accept');

  const star = withVaryAccept(new Response('x', { headers: { vary: '*' } }));
  assert.equal(star.headers.get('vary'), '*');
});

test('a page asked for as markdown answers markdown with Vary', async () => {
  const { response } = await call('/about/', { accept: 'text/markdown' });
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get('content-type'),
    'text/markdown; charset=utf-8',
  );
  assert.equal(response.headers.get('vary'), 'accept');
  assert.equal(await response.text(), '# About\n');
});

test('the homepage has a twin at /index.md', async () => {
  const { response } = await call('/', { accept: 'text/markdown' });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '# Home\n');
});

test('the markdown answer carries the twin file validators', async () => {
  const { response } = await call('/', { accept: 'text/markdown' });
  assert.equal(response.headers.get('etag'), '"home-etag"');
  assert.equal(response.headers.get('cache-control'), 'public, max-age=0');
});

test('a browser Accept keeps HTML and still declares Vary', async () => {
  const { response } = await call('/about/', {
    accept: BROWSER_ACCEPT,
    ua: BROWSER_UA,
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.equal(response.headers.get('vary'), 'accept');
  assert.equal(await response.text(), '<html>about</html>');
});

test('a bare */* keeps HTML', async () => {
  const { response } = await call('/about/', { accept: '*/*' });
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.equal(response.headers.get('vary'), 'accept');
});

test('html outranking markdown keeps HTML', async () => {
  const { response } = await call('/about/', {
    accept: 'text/html, text/markdown;q=0.5',
  });
  assert.match(response.headers.get('content-type'), /text\/html/);
});

test('markdown outranking html serves markdown', async () => {
  const { response } = await call('/about/', {
    accept: 'text/html;q=0.5, text/markdown;q=0.9',
  });
  assert.match(response.headers.get('content-type'), /text\/markdown/);
});

test('a page with no markdown twin falls through to HTML', async () => {
  const { response } = await call('/work/', { accept: 'text/markdown' });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.equal(response.headers.get('vary'), 'accept');
});

test('an asset path is never negotiated and never marked Vary', async () => {
  const { response, env } = await call('/content/images/logo.svg', {
    accept: 'text/markdown',
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/svg+xml');
  assert.equal(response.headers.get('vary'), null);
  assert.deepEqual(env.ASSETS.calls, ['/content/images/logo.svg']);
});

test('sitemap.xml is never negotiated', async () => {
  const { response } = await call('/sitemap.xml', { accept: 'text/markdown' });
  assert.equal(response.headers.get('content-type'), 'application/xml');
  assert.equal(response.headers.get('vary'), null);
});

test('a browser request costs no extra subrequest', async () => {
  const { env } = await call('/about/', {
    accept: BROWSER_ACCEPT,
    ua: BROWSER_UA,
  });
  assert.deepEqual(env.ASSETS.calls, ['/about/']);
});

test('a POST is never negotiated', async () => {
  const { response } = await call('/about/', {
    accept: 'text/markdown',
    method: 'POST',
  });
  assert.match(response.headers.get('content-type'), /text\/html/);
});

test('a HEAD request gets the markdown headers', async () => {
  const { response } = await call('/about/', {
    accept: 'text/markdown',
    method: 'HEAD',
  });
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get('content-type'),
    'text/markdown; charset=utf-8',
  );
});

test('a redirect from the assets layer is not shadowed by markdown', async () => {
  const assets = {
    calls: [],
    fetch(input) {
      const url = new URL(typeof input === 'string' ? input : input.url);
      assets.calls.push(url.pathname);
      if (url.pathname === '/about') {
        return Promise.resolve(
          new Response(null, { status: 308, headers: { location: '/about/' } }),
        );
      }
      return Promise.resolve(new Response('# About\n', { status: 200 }));
    },
  };
  const { response } = await call('/about', {
    accept: 'text/markdown',
    assets,
  });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), '/about/');
  assert.deepEqual(assets.calls, ['/about']);
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
  assert.match(body, /https:\/\/example\.test\//);
});

test('a curl-shaped 404 gets the markdown body', async () => {
  const { response } = await call('/nope');
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

test('the 404 body names the requesting origin, not a fixed host', () => {
  assert.match(
    notFoundMarkdown('https://other.example'),
    /https:\/\/other\.example\//,
  );
});

test('a real page still answers 200', async () => {
  const { response } = await call('/about/', {
    accept: BROWSER_ACCEPT,
    ua: BROWSER_UA,
  });
  assert.equal(response.status, 200);
});
