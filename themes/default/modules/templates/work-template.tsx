import { Contact } from '../../components';
import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';

export default function WorkTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig } = props;

  return (
    <Layout siteConfig={siteConfig}>
      <section className="dwarves-container">{children}</section>

      {/* CTA */}
      <Contact />
    </Layout>
  );
}
