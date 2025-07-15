import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';

export default function AboutTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig } = props;

  return (
    <Layout siteConfig={siteConfig}>
      <div className="flex-grow py-2">{children}</div>
    </Layout>
  );
}
