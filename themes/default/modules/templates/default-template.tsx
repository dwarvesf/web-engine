import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';

export default function DefaultTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig } = props;
  return <Layout siteConfig={siteConfig}>{children}</Layout>;
}
