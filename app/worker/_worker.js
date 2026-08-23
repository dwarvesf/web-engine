/**
 * Cloudflare Pages advanced-mode worker for the exported site.
 *
 * `wrangler pages deploy ./out` picks up `out/_worker.js` on its own, so this
 * file needs no project, domain or CI change. In advanced mode the worker owns
 * every request, so anything it does not handle falls through to
 * `env.ASSETS.fetch(request)` unchanged.
 *
 * It does two things a static export cannot:
 *
 *   1. Content negotiation. A client that asks for `text/markdown` gets the
 *      page's markdown twin, written next to the page as `<route>/index.md` by
 *      `scripts/generate-agent-files.ts`. Both answers declare `Vary: Accept`.
 *   2. A 404 body a text client can read, pointing at the site's own indexes.
 *
 * Plain JavaScript on purpose: it ships as-is, with no bundling step between
 * this file and the deployed worker.
 */

/** Assets a client named directly. Negotiation must never touch these. */
const RESERVED_PREFIX = /^\/(_next|content)(\/|$)/;

/**
 * The page route a request is asking for, or null when the request names a
 * file rather than a route. The homepage is the empty string.
 */
function pageRoute(pathname) {
  if (RESERVED_PREFIX.test(pathname)) {
    return null;
  }
  const route = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (/\.[^/]+$/.test(route)) {
    return null;
  }
  return route;
}

/** The markdown twin for a page route. */
function markdownPath(route) {
  return `${route}/index.md`;
}

/**
 * The highest q-value an Accept header gives one media type, or -1 when the
 * header does not name that type at all. Enough to rank two types against each
 * other. A wildcard range deliberately does not count as naming a type: `*\/*`
 * is what a client sends when it has no opinion.
 */
function acceptQuality(accept, type) {
  let best = -1;
  for (const entry of accept.split(',')) {
    const [range, ...params] = entry.split(';');
    if (range.trim().toLowerCase() !== type) {
      continue;
    }
    const q = params.map(p => /^\s*q=([\d.]+)\s*$/i.exec(p)).find(Boolean);
    best = Math.max(best, q ? Number(q[1]) : 1);
  }
  return best;
}

/**
 * A page answers in markdown only for a client that names `text/markdown` AND
 * ranks it above `text/html`. This is stricter than `prefersTextBody` below,
 * and deliberately so: that helper decides what body a page that does NOT
 * exist carries, where nothing is lost by choosing text, while this one
 * replaces a real rendered page. A bare `*\/*` therefore keeps HTML. curl
 * sends it, and so do link unfurlers and most crawlers, which came for the
 * `og:` tags, the canonical link and the JSON-LD that exist only in the HTML.
 */
function prefersMarkdownPage(accept) {
  const markdown = acceptQuality(accept, 'text/markdown');
  return markdown > 0 && markdown > acceptQuality(accept, 'text/html');
}

/**
 * A browser always asks for text/html. Anything asking for markdown or plain
 * text gets the text body; so does a client that states no preference and does
 * not identify as a browser, which is the shape curl and most agents send.
 */
function prefersTextBody(request) {
  const accept = (request.headers.get('accept') ?? '').trim();
  if (
    acceptQuality(accept, 'text/markdown') >= 0 ||
    acceptQuality(accept, 'text/plain') >= 0
  ) {
    return true;
  }
  if (accept !== '' && accept !== '*/*') {
    return false;
  }
  return !/Mozilla/i.test(request.headers.get('user-agent') ?? '');
}

/**
 * Vary tells a shared cache the URL has more than one representation, so it
 * must key on Accept. It belongs on the HTML answer as much as the markdown
 * one: without it a CDN can hand its cached HTML to a client that asked for
 * markdown, which is the whole failure this negotiation exists to avoid.
 */
function withVaryAccept(response) {
  // Token comparison, not a substring test: `Accept-Encoding` contains
  // "accept", and treating that as a match would silently skip the header this
  // function exists to add. `*` already covers every header.
  const listed = (response.headers.get('vary') ?? '')
    .split(',')
    .map(token => token.trim().toLowerCase());
  if (listed.includes('accept') || listed.includes('*')) {
    return response;
  }
  const headers = new Headers(response.headers);
  headers.append('vary', 'accept');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * The site's own recovery routes. Built from the request origin rather than a
 * configured hostname: the engine serves more than one site.
 */
function notFoundMarkdown(origin) {
  return `# 404 Not Found

No page exists at this URL on ${origin}.

- Page index: ${origin}/sitemap.xml
- Agent index: ${origin}/llms.txt
- Home: ${origin}/
`;
}

function markdownResponse(body, status, source) {
  const headers = new Headers({
    'content-type': 'text/markdown; charset=utf-8',
    vary: 'accept',
  });
  // The markdown is its own representation, so it carries the markdown file's
  // validators rather than the HTML page's.
  for (const header of ['etag', 'last-modified', 'cache-control']) {
    const value = source?.headers.get(header);
    if (value) {
      headers.set(header, value);
    }
  }
  return new Response(body, { status, headers });
}

/**
 * A text client gets a short markdown body it can act on. A browser gets the
 * styled 404 page unchanged. Cloudflare Pages already answers a miss with
 * `404.html`, so that response is reused when it is the HTML document; the
 * explicit fetch is the fallback for a miss it answered with nothing.
 */
async function notFound(request, env, url, asset) {
  if (prefersTextBody(request)) {
    return markdownResponse(notFoundMarkdown(url.origin), 404);
  }
  let doc = asset;
  if (!doc || !/text\/html/i.test(doc.headers.get('content-type') ?? '')) {
    doc = await env.ASSETS.fetch(new URL('/404.html', url.origin).toString());
  }
  if (!/text\/html/i.test(doc.headers.get('content-type') ?? '')) {
    return markdownResponse(notFoundMarkdown(url.origin), 404);
  }
  return new Response(doc.body, {
    status: 404,
    headers: {
      'content-type':
        doc.headers.get('content-type') ?? 'text/html; charset=utf-8',
      vary: 'accept',
    },
  });
}

/** The page's markdown twin, or null when the page has none. */
async function serveMarkdownVariant(request, env, url, route) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return null;
  }
  if (!prefersMarkdownPage(request.headers.get('accept') ?? '')) {
    return null;
  }
  const twin = await env.ASSETS.fetch(
    new URL(markdownPath(route), url.origin).toString(),
  );
  if (!twin.ok) {
    return null;
  }
  return markdownResponse(twin.body, 200, twin);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const asset = await env.ASSETS.fetch(request);

    if (asset.status === 404) {
      return notFound(request, env, url, asset);
    }

    const route = pageRoute(url.pathname);
    // Not a page route, or the assets layer answered with a redirect: hand it
    // back untouched. Letting the asset answer come first is what keeps a route
    // that is also a redirect source redirecting instead of being shadowed by
    // its own markdown.
    if (route === null || asset.status !== 200) {
      return asset;
    }

    const markdown = await serveMarkdownVariant(request, env, url, route);
    if (markdown) {
      return markdown;
    }

    // Every page route is marked as varying by Accept, including one with no
    // markdown twin. That over-declares for those routes: it costs a little
    // cache efficiency and can never serve a client the wrong representation.
    return withVaryAccept(asset);
  },
};

export const __test__ = {
  acceptQuality,
  markdownPath,
  notFoundMarkdown,
  pageRoute,
  prefersMarkdownPage,
  prefersTextBody,
  withVaryAccept,
};
