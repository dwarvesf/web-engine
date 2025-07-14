import { lazy, Suspense } from 'react';
import { TemplateRenderArgs, ThemeTemplates } from '../types/theme';

const TemplateRender: React.FC<TemplateRenderArgs> = props => {
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
