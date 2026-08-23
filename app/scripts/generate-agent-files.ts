// Emits the machine-readable entry points for the exported site: sitemap.xml,
// llms.txt, robots.txt, and the Pages worker. Runs after `next build`, over the
// exported out/ directory.
import { glob } from 'glob';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BUILD_OUT_DIR, ORIGINAL_SITE_CONFIG_CONTENT } from './paths';

type Tab = { tab: string; href?: string };

type SiteJson = {
  site?: { title?: string; description?: string; url?: string };
  header?: {
    logo?: { alt?: string };
    navigation?: { tabs?: Tab[] };
    [key: string]: unknown;
  };
  llms?: {
    description?: string;
    'when-to-use'?: string[];
    links?: { title: string; href: string }[];
  };
};

// The engine serves more than one content repo, so every site-specific value
// below is read from site.json. These defaults only apply when it stays silent.
const DEFAULT_URL = 'https://dwarves.foundation';
const DEFAULT_WHEN_TO_USE = (name: string) => [
  `Evaluating ${name} as a software development partner.`,
  'Checking the services and engineering capabilities on offer.',
  'Finding contact details and company information.',
  'Reading the published work, case studies and open-source projects.',
];

function readSiteJson(): SiteJson {
  if (!existsSync(ORIGINAL_SITE_CONFIG_CONTENT)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(ORIGINAL_SITE_CONFIG_CONTENT, 'utf-8'));
  } catch (error) {
    console.warn('⚠️  Could not parse site.json:', (error as Error).message);
    return {};
  }
}

function basePath(): string {
  const raw = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || '';
  if (!raw) {
    return '';
  }
  return (raw.startsWith('/') ? raw : `/${raw}`).replace(/\/$/, '');
}

function origin(siteJson: SiteJson): string {
  return (siteJson.site?.url || DEFAULT_URL).replace(/\/$/, '');
}

function absolute(siteJson: SiteJson, href: string): string {
  if (/^https?:\/\//.test(href)) {
    return href;
  }
  const suffix = href.startsWith('/') ? href : `/${href}`;
  return `${origin(siteJson)}${basePath()}${suffix}`;
}

/** Every exported page, as a site-root-relative path with a trailing slash. */
async function exportedRoutes(): Promise<string[]> {
  const files = await glob('**/*.html', { cwd: BUILD_OUT_DIR, posix: true });
  const routes = files
    .map(file => `/${file.replace(/index\.html$/, '').replace(/\.html$/, '/')}`)
    .map(route => (route.endsWith('/') ? route : `${route}/`))
    .filter(route => route !== '/404/');
  return Array.from(new Set(routes)).sort();
}

function writeSitemap(siteJson: SiteJson, routes: string[]) {
  const body = routes
    .map(route => `  <url><loc>${absolute(siteJson, route)}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  const target = path.join(BUILD_OUT_DIR, 'sitemap.xml');
  writeFileSync(target, xml, 'utf-8');
  console.log(`✅ Generated sitemap.xml with ${routes.length} URLs`);
}

/** Named links an agent should follow, from site.json's own navigation. */
function navLinks(siteJson: SiteJson): { title: string; href: string }[] {
  if (siteJson.llms?.links) {
    return siteJson.llms.links;
  }
  const navs = Object.values(siteJson.header ?? {}).filter(
    (value): value is { tabs?: Tab[] } =>
      typeof value === 'object' && value !== null && 'tabs' in value,
  );
  const links: { title: string; href: string }[] = [];
  for (const nav of navs) {
    for (const tab of nav.tabs ?? []) {
      if (tab.href && !tab.href.startsWith('#')) {
        links.push({ title: tab.tab, href: tab.href });
      }
    }
  }
  return links;
}

function writeLlmsTxt(siteJson: SiteJson) {
  const name =
    siteJson.header?.logo?.alt || siteJson.site?.title || 'This site';
  const description =
    siteJson.llms?.description || siteJson.site?.description || '';
  const whenToUse = siteJson.llms?.['when-to-use'] || DEFAULT_WHEN_TO_USE(name);

  const links = [
    { title: 'Home', href: '/' },
    { title: 'Sitemap', href: '/sitemap.xml' },
    ...navLinks(siteJson),
  ];
  const seen = new Set<string>();
  const linkLines: string[] = [];
  for (const link of links) {
    // The export serves routes with a trailing slash; leave files alone.
    const href =
      /^https?:\/\//.test(link.href) ||
      link.href.endsWith('/') ||
      path.extname(link.href)
        ? link.href
        : `${link.href}/`;
    const url = absolute(siteJson, href);
    if (seen.has(url)) {
      continue;
    }
    seen.add(url);
    linkLines.push(`- ${link.title}: ${url}`);
  }

  const text = `# ${name}

${description}

## When to use

${whenToUse.map(line => `- ${line}`).join('\n')}

## How to fetch content

Every page is static HTML served at its own URL. Fetch the URL and read the
markup directly; no JavaScript execution is needed. ${absolute(siteJson, '/sitemap.xml')}
lists every page on the site.

## Links

${linkLines.join('\n')}
`;
  const target = path.join(BUILD_OUT_DIR, 'llms.txt');
  writeFileSync(target, text, 'utf-8');
  console.log('✅ Generated llms.txt');
}

// With no robots.txt in the export, Cloudflare answers /robots.txt with its own
// managed file. On this zone that file is 24 lines of comment explaining what
// content signals mean and sets no directive at all, so replacing it costs
// nothing and buys the Sitemap pointer. Setting real content signals later is a
// Cloudflare-side choice that would have to move back in here.
function writeRobotsTxt(siteJson: SiteJson) {
  const text = `User-agent: *
Allow: /

Sitemap: ${absolute(siteJson, '/sitemap.xml')}
`;
  const target = path.join(BUILD_OUT_DIR, 'robots.txt');
  writeFileSync(target, text, 'utf-8');
  console.log('✅ Generated robots.txt');
}

// Cloudflare Pages runs out/_worker.js at request time; `wrangler pages deploy`
// picks it up with no project change. GitHub Pages ignores it and serves the
// same export statically, minus the 404 body.
function writeWorker() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const source = path.join(scriptDir, '..', 'worker', '_worker.js');
  if (!existsSync(source)) {
    console.warn('⚠️  Worker source not found, skipping:', source);
    return;
  }
  copyFileSync(source, path.join(BUILD_OUT_DIR, '_worker.js'));
  console.log('✅ Copied _worker.js');
}

async function main() {
  if (!existsSync(BUILD_OUT_DIR)) {
    console.error('❌ Build output directory not found:', BUILD_OUT_DIR);
    process.exit(1);
  }
  const siteJson = readSiteJson();
  writeSitemap(siteJson, await exportedRoutes());
  writeLlmsTxt(siteJson);
  writeRobotsTxt(siteJson);
  writeWorker();
}

main().catch(error => {
  console.error('❌ Failed to generate agent files:', error);
  process.exit(1);
});
