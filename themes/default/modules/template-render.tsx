import React, { JSX, lazy, Suspense, useEffect, useState } from 'react';
import { TemplateRenderArgs, ThemeTemplates } from '../types/theme';
import { appConfigService } from '../services/app-config';

// Components
const AboutTemplate = lazy(() => import('./templates/about-template'));
const OpensourceTemplate = lazy(
  () => import('./templates/opensource-template'),
);
const WorkTemplate = lazy(() => import('./templates/work-template'));
const WorkDetailTemplate = lazy(
  () => import('./templates/work-detail-template'),
);
const ServicesTemplate = lazy(() => import('./templates/services-template'));
const DefaultTemplate = lazy(() => import('./templates/default-template'));

const TemplateRender: React.FC<TemplateRenderArgs> = props => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the app configuration
    appConfigService.setConfig(props.env ?? {});
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
      Component = AboutTemplate;
      break;
    case ThemeTemplates.Opensource:
      Component = OpensourceTemplate;
      break;
    case ThemeTemplates.Work:
      Component = WorkTemplate;
      break;
    case ThemeTemplates.WorkDetail:
      Component = WorkDetailTemplate;
      break;
    case ThemeTemplates.Services:
      Component = ServicesTemplate;
      break;
    default:
      Component = DefaultTemplate;
      break;
  }
  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};

export default TemplateRender;
