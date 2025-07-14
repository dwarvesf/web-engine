import { Contact } from '../../components';
import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';

export default function WorkTemplate(props: TemplateRenderArgs) {
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
      <section className="dwarves-container">{children}</section>

      {/* CTA */}
      <Contact />
    </Layout>
  );
}
