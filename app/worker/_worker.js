/**
 * Cloudflare Pages advanced-mode worker for the exported site.
 *
 * `wrangler pages deploy ./out` picks up `out/_worker.js` on its own, so this
 * file needs no project, domain or CI change. In advanced mode the worker owns
 * every request, so anything it does not handle falls through to
 * `env.ASSETS.fetch(request)` unchanged.
 *
 * It does one thing a static export cannot: give a 404 a body a text client can
 * act on, pointing at the site's own indexes. Every other request is the asset
 * response, untouched.
 *
 * Plain JavaScript on purpose: it ships as-is, with no bundling step between
 * this file and the deployed worker.
 */

/**
 * The highest q-value an Accept header gives one media type, or -1 when the
 * header does not name that type at all. A wildcard range deliberately does not
 * count as naming a type: `*\/*` is what a client sends when it has no opinion.
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
 * A browser always asks for text/html. Anything asking for markdown or plain
 * text gets the text body; so does a client that states no preference and does
 * not identify as a browser, which is the shape curl and most agents send.
 *
 * This is looser than a page-level negotiation rule would be, and deliberately
 * so. On a 404 there is no rendered page to lose, so a text body is strictly
 * more useful. On a real page a bare `*\/*` is what link unfurlers and crawlers
 * send, and they came for the `og:` tags that exist only in the HTML.
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

/**
 * `Vary: Accept` because this URL has two representations that differ by
 * Accept. Without it a shared cache can hand the HTML 404 to a client that
 * asked for text, or the other way round.
 */
function markdownNotFound(origin) {
  return new Response(notFoundMarkdown(origin), {
    status: 404,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      vary: 'accept',
    },
  });
}

/**
 * A text client gets a short markdown body it can act on. A browser gets the
 * styled 404 page unchanged. Cloudflare Pages already answers a miss with
 * `404.html`, so that response is reused when it is the HTML document; the
 * explicit fetch is the fallback for a miss it answered with nothing.
 */
async function notFound(request, env, url, asset) {
  if (prefersTextBody(request)) {
    return markdownNotFound(url.origin);
  }
  let doc = asset;
  if (!doc || !/text\/html/i.test(doc.headers.get('content-type') ?? '')) {
    doc = await env.ASSETS.fetch(new URL('/404.html', url.origin).toString());
  }
  if (!/text\/html/i.test(doc.headers.get('content-type') ?? '')) {
    return markdownNotFound(url.origin);
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

export default {
  async fetch(request, env) {
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) {
      return asset;
    }
    return notFound(request, env, new URL(request.url), asset);
  },
};

export const __test__ = {
  acceptQuality,
  notFoundMarkdown,
  prefersTextBody,
};
