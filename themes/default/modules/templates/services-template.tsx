import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';
import { Contact, ServiceContact } from '../../components';
import {
  TemplateInputField,
  TemplateSelectField,
} from '../../components/service-contact';

interface FrontmatterMetadata {
  'form-options': {
    title: string;
    'form-image': string;
    className: string;
    'service-name': string;
    'additional-info-field-label'?: string;
    'show-select-location': boolean;
    'input-fields'?: TemplateInputField[];
    'select-fields'?: TemplateSelectField[];
  };
}

export default function ServicesTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig, frontmatter } = props;
  const metadata = frontmatter as FrontmatterMetadata;
  const formOptions = metadata?.['form-options'];
  const selectFields = formOptions?.['select-fields'] || [];
  const inputFields = formOptions?.['input-fields'] || [];
  const isShowSelectLocation = formOptions?.['show-select-location'] ?? true;
  const additionalInfoFieldLabel = formOptions?.['additional-info-field-label'];

  return (
    <Layout siteConfig={siteConfig}>
      {/* Main Content */}
      {children}

      {formOptions?.['service-name'] ? (
        <ServiceContact
          title={formOptions.title}
          serviceName={formOptions['service-name']}
          bgImage={formOptions['form-image']}
          className={formOptions['className']}
          templateSelectFields={selectFields}
          templateInputFields={inputFields}
          isShowSelectLocation={isShowSelectLocation}
          additionalInfoFieldLabel={additionalInfoFieldLabel}
        />
      ) : (
        <Contact />
      )}
    </Layout>
  );
}
