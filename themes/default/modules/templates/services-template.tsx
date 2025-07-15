import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';
import { cn } from '../../utils';
import { ServiceContact } from '../../components';

interface FrontmatterMetadata {
  'form-options': {
    title: string;
    'form-image': string;
    'service-name': string;
    options: {
      label: string;
      description?: string;
    }[];
  };
}

export default function ServicesTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig, frontmatter } = props;
  const metadata = frontmatter as FrontmatterMetadata;
  const formOptions = metadata['form-options'] || [];

  return (
    <Layout
      siteConfig={siteConfig}
      contentClassName={cn('dwarves-container article-content')}
    >
      {/* Main Content */}
      <div className="flex-1 py-12">{children}</div>

      {formOptions && (
        <ServiceContact
          title={formOptions.title}
          serviceName={formOptions['service-name']}
          bgImage={formOptions['form-image']}
          options={formOptions.options.map(option => ({
            label: option.label,
            value: option.label,
            'pre-fill-message': option.description,
          }))}
        />
      )}
    </Layout>
  );
}
