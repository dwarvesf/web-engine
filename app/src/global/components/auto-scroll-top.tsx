'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

interface AutoScrollToTopProps {
  children: React.ReactNode;
}

const AutoScrollToTop: React.FC<AutoScrollToTopProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Extract hash from the URL, removing the leading '#'
      const id = new URL(url, window.location.origin).hash.substring(1);
      if (id) {
        return;
      }

      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
    };
    router.events.on('beforeHistoryChange', handleRouteChange);

    return () => {
      router.events.off('beforeHistoryChange', handleRouteChange);
    };
  }, [router.events]);

  return <>{children}</>;
};

export default AutoScrollToTop;
