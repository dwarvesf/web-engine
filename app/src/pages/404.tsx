import { getSiteConfig, themeAdapter } from '@wse/global/adapters';
import React from 'react';

const Default404 = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h3 className="text-2xl font-bold">404 - Page Not Found</h3>
      <p className="mt-4">The page you are looking for does not exist.</p>
    </div>
  );
};

const NotFoundTemplate =
  themeAdapter.loadThemeModules()?.NotFoundTemplate ?? Default404;

const NotFound = () => {
  return <NotFoundTemplate siteConfig={getSiteConfig()} />;
};

export default NotFound;
