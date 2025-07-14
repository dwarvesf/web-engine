import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';

export default function DefaultTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig } = props;
  return (
    <Layout
      siteConfig={siteConfig}
      headerProps={{
        className:
          'px-[calc(50dvw-(var(--spacing-container-max))/2+0.5rem)] w-full',
      }}
      footerProps={{ className: 'dwarves-container w-full' }}
    >
      {children}
    </Layout>
  );
}
