import { lazy, Suspense, useEffect, useState } from 'react';
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
  switch (template) {
    case ThemeTemplates.About:
      const AboutTemplate = lazy(() => import('./templates/about-template'));
      return (
        <Suspense fallback={null}>
          <AboutTemplate {...props} />
        </Suspense>
      );
    case ThemeTemplates.Opensource:
      const OpensourceTemplate = lazy(
        () => import('./templates/opensource-template'),
      );
      return (
        <Suspense fallback={null}>
          <OpensourceTemplate {...props} />
        </Suspense>
      );
    case ThemeTemplates.Work:
      const WorkTemplate = lazy(() => import('./templates/work-template'));
      return (
        <Suspense fallback={null}>
          <WorkTemplate {...props} />
        </Suspense>
      );
    case ThemeTemplates.WorkDetail:
      const WorkDetailTemplate = lazy(
        () => import('./templates/work-detail-template'),
      );
      return (
        <Suspense fallback={null}>
          <WorkDetailTemplate {...props} />
        </Suspense>
      );
    case ThemeTemplates.Services:
      const ServicesTemplate = lazy(
        () => import('./templates/services-template'),
      );
      return (
        <Suspense fallback={null}>
          <ServicesTemplate {...props} />
        </Suspense>
      );
    default:
      const DefaultTemplate = lazy(
        () => import('./templates/default-template'),
      );
      return (
        <Suspense fallback={null}>
          <DefaultTemplate {...props} />
        </Suspense>
      );
  }
};

export default TemplateRender;
