import { ContactForm } from '../../components';
import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';

export default function StartupTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig } = props;

  return (
    <Layout siteConfig={siteConfig}>
      {children}
      <ContactForm />
    </Layout>
  );
}
