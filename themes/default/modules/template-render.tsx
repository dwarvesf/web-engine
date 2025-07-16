import React, { JSX, lazy, Suspense, useEffect, useState } from 'react';
import { TemplateRenderArgs, ThemeTemplates } from '../types/theme';

const TemplateRender: React.FC<TemplateRenderArgs> = props => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  const template = props.frontmatter?.template;
  let Component: React.LazyExoticComponent<
    (props: TemplateRenderArgs) => JSX.Element
  >;
  switch (template) {
    case ThemeTemplates.About:
      Component = lazy(() => import('./templates/about-template'));
      break;
    case ThemeTemplates.Opensource:
      Component = lazy(() => import('./templates/opensource-template'));
      break;
    case ThemeTemplates.Work:
      Component = lazy(() => import('./templates/work-template'));
      break;
    case ThemeTemplates.WorkDetail:
      Component = lazy(() => import('./templates/work-detail-template'));
      break;
    case ThemeTemplates.Services:
      Component = lazy(() => import('./templates/services-template'));
      break;
    case ThemeTemplates.Startup:
      Component = lazy(() => import('./templates/startup-template'));
      break;
    default:
      Component = lazy(() => import('./templates/default-template'));
      break;
  }
  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};

export default TemplateRender;
