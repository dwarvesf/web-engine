'use client';

import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

interface GlobalRouteHandlerProps {
  children: React.ReactNode;
}

const GlobalRouteHandler: React.FC<GlobalRouteHandlerProps> = ({
  children,
}) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const routerRef = useRef(router);

  // Keep router reference updated without causing re-renders
  routerRef.current = router;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isAnchor = target.tagName.toLowerCase() === 'a';
      const anchor = isAnchor
        ? (target as HTMLAnchorElement)
        : target.closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip if:
      // - External URLs (http/https)
      // - mailto/tel links
      // - Hash-only links on same page
      // - Links with target="_blank"
      // - Links with download attribute
      // - Command/Ctrl + click (open in new tab)
      // - Right click
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href === '#' ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.button !== 0
      ) {
        return;
      }

      // Handle hash links on same page
      if (href.startsWith('#')) {
        // Prevent default behavior for hash links
        e.preventDefault();
        const targetElement = document.getElementById(href.slice(1));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // Handle internal navigation
      if (
        href.startsWith('/') ||
        href.startsWith('./') ||
        href.startsWith('../')
      ) {
        e.preventDefault();

        // Resolve relative paths
        let resolvedPath = href;
        if (href.includes(window.location.host)) {
          const currentPath = routerRef.current.asPath.split('#')[0];
          const url = new URL(href, `${window.location.origin}${currentPath}`);
          resolvedPath = url.pathname + url.search + url.hash;
        }
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
        // Use Next.js router for navigation
        routerRef.current.push(resolvedPath, resolvedPath, { scroll: false });
        return;
      }

      // Handle same-domain links
      try {
        const url = new URL(href, window.location.origin);
        if (url.hostname === window.location.hostname) {
          e.preventDefault();
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          });
          routerRef.current.push(url.pathname + url.search + url.hash);
        }
      } catch {
        // Invalid URL, let browser handle it
      }
    };

    // Use event delegation for performance
    container.addEventListener('click', handleClick, true);

    return () => {
      container.removeEventListener('click', handleClick, true);
    };
  }, []); // Empty dependency array - runs once on mount

  return <div ref={containerRef}>{children}</div>;
};

export default GlobalRouteHandler;
