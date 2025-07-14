import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';

export default function DefaultTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig } = props;
  return (
    <Layout
      siteConfig={siteConfig}
      headerProps={{ className: 'dwarves-container w-full' }}
      footerProps={{ className: 'dwarves-container w-full' }}
      contentClassName="dwarves-container"
    >
      {children}
    </Layout>
  );
}
