// Builds the Organization JSON-LD block from site.json. The engine serves more
// than one content repo, so nothing here is hardcoded: every value is derived
// from the site config, and a field that the config does not carry is omitted.
import { SiteConfig, SiteConfigLoader } from '../config/site-config';

type PostalAddress = {
  '@type': 'PostalAddress';
  addressCountry: string;
  addressLocality?: string;
  streetAddress?: string;
};

export type OrganizationSchema = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: 'sales';
    email: string;
  };
  address?: PostalAddress[];
};

export function siteOrigin(siteConfig?: SiteConfig): string {
  return (siteConfig?.site?.url || '').replace(/\/$/, '');
}

/** Absolute URL for a site-root-relative path, honouring the base path. */
export function absoluteUrl(siteConfig: SiteConfig | undefined, href: string) {
  if (/^https?:\/\//.test(href)) {
    return href;
  }
  const basePath = SiteConfigLoader.BASE_PATH_URL;
  const suffix = href.startsWith('/') ? href : `/${href}`;
  // The runtime config resolver already prefixes the base path onto asset
  // paths, so only add it when the caller passes a raw route.
  const prefix = suffix.startsWith(`${basePath}/`) ? '' : basePath;
  return `${siteOrigin(siteConfig)}${prefix}${suffix}`;
}

/** Every social profile URL reachable in the config, in document order. */
function collectSameAs(node: unknown, found: string[] = []): string[] {
  if (!node || typeof node !== 'object') {
    return found;
  }
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key === 'socials' && value && typeof value === 'object') {
      for (const entry of Object.values(value as Record<string, unknown>)) {
        const url = Array.isArray(entry) ? entry[0] : entry;
        if (typeof url === 'string' && /^https?:\/\//.test(url)) {
          found.push(url);
        }
      }
    } else if (value && typeof value === 'object') {
      collectSameAs(value, found);
    }
  }
  return found;
}

/** Keeps the first spelling of each URL, ignoring a trailing slash. */
function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  return urls.filter(url => {
    const key = url.replace(/\/$/, '');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Office addresses, read from the footer text entries the site already
 * publishes, keyed as a two-letter country code (for example `VN:`).
 * ponytail: a convention over a dedicated config field; add an explicit
 * `organization.address` to site.json if a site needs a different shape.
 */
function collectAddresses(siteConfig?: SiteConfig): PostalAddress[] {
  const sections = [
    ...(siteConfig?.footer?.['column-sections'] ?? []),
    ...(siteConfig?.footer?.sections ?? []),
  ];
  const addresses: PostalAddress[] = [];
  for (const section of sections) {
    for (const entry of section.content ?? []) {
      const country = /^([A-Z]{2}):$/.exec(entry.title ?? '')?.[1];
      if (!country || !entry.text) {
        continue;
      }
      const parts = entry.text.split(',').map(part => part.trim());
      addresses.push({
        '@type': 'PostalAddress',
        addressCountry: country,
        addressLocality: parts.length > 1 ? parts[parts.length - 1] : undefined,
        streetAddress:
          parts.length > 1 ? parts.slice(0, -1).join(', ') : entry.text,
      });
    }
  }
  return addresses;
}

export function buildOrganizationSchema(
  siteConfig?: SiteConfig,
): OrganizationSchema | null {
  const url = siteOrigin(siteConfig);
  const name = siteConfig?.header?.logo?.alt || siteConfig?.site?.title;
  if (!url || !name) {
    return null;
  }

  const logoSrc = siteConfig?.header?.logo?.src;
  const sameAs = dedupeUrls(collectSameAs(siteConfig));
  const email = siteConfig?.footer?.global?.email;
  const addresses = collectAddresses(siteConfig);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(siteConfig?.site?.description
      ? { description: siteConfig.site.description }
      : {}),
    ...(logoSrc ? { logo: absoluteUrl(siteConfig, logoSrc) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(email
      ? {
          contactPoint: {
            '@type': 'ContactPoint' as const,
            contactType: 'sales' as const,
            email,
          },
        }
      : {}),
    ...(addresses.length ? { address: addresses } : {}),
  };
}
