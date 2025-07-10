import { cn } from '../../utils';
import { SocialLink } from '../../components';

// Helper function to transform social links from site config format
function transformSocialLinks(
  socials: Record<string, string | [string, string] | [string, string, string]>,
) {
  return Object.entries(socials).map(([key, value]) => {
    if (typeof value === 'string') {
      return {
        name: key,
        href: value,
        icon: key.toLowerCase(),
      };
    }

    if (Array.isArray(value)) {
      return {
        name: value[2] || key,
        href: value[0],
        icon: value[1] || key.toLowerCase(),
      };
    }

    return {
      name: key,
      href: '#',
      icon: key.toLowerCase(),
    };
  });
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title?: string;
  href?: string;
  'hide-title'?: boolean;
  content?: {
    type: string;
    title: string;
    text: string;
  }[];
  socials?: Record<
    string,
    string | [string, string] | [string, string, string]
  >;
  tabs?: {
    tab: string;
    href: string;
    type?: string[];
    tag?: string;
  }[];
  links?: FooterLink[];
}

interface SocialConfig {
  [key: string]: string | [string, string] | [string, string, string];
}

interface FooterConfig {
  global?: {
    text: string;
    email: string;
    socials?: SocialConfig;
  };
  'column-sections'?: FooterSection[];
  sections?: FooterSection[];
}

interface FooterProps {
  footer?: FooterConfig;
  className?: string;
}

export default function Footer({ footer, className = '' }: FooterProps) {
  if (!footer) return null;

  const columnSections = footer['column-sections'] || [];
  const rowSections = footer.sections || [];
  const globalMetadata = footer.global;

  const socialLinks = transformSocialLinks(globalMetadata?.socials || {});
  const renderSectionContent = (section: FooterSection) => {
    return (
      <>
        {section.content?.map((content, contentIndex) => (
          <div key={contentIndex} className="mb-2 block space-x-2">
            <h5 className="text-foreground inline-block text-sm font-medium">
              {content.title}
            </h5>
            <p className="text-tag-foreground dark:text-muted-foreground inline-block text-sm">
              {content.text}
            </p>
          </div>
        ))}
        {section.socials && (
          <div className="mb-4 flex space-x-4">
            {transformSocialLinks(section.socials).map((social, index) => (
              <SocialLink
                key={index}
                name={social.name}
                href={social.href}
                icon={social.icon}
              />
            ))}
          </div>
        )}
        <ul className="space-y-2">
          {section.links?.map((link, linkIndex) => (
            <li key={linkIndex}>
              <a
                href={link.href}
                className="text-tag-foreground dark:text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
          {section.tabs?.map((tab, tabIndex) => (
            <li key={tabIndex}>
              <a
                href={tab.href}
                className="text-tag-foreground dark:text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
              >
                {tab.tab}
              </a>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <footer className={cn('bg-background border-border border-t', className)}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Column Sections Layout */}
        {columnSections.length > 0 && (
          <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
            {/* Column Sections */}
            {columnSections.map((section, index) => (
              <div key={index}>
                {!section['hide-title'] && section.title && (
                  <h4 className="text-foreground mb-4 text-sm font-semibold">
                    {section.href ? (
                      <a
                        href={section.href}
                        className="hover:text-primary transition-colors duration-200"
                      >
                        {section.title}
                      </a>
                    ) : (
                      section.title
                    )}
                  </h4>
                )}
                {renderSectionContent(section)}
              </div>
            ))}
          </div>
        )}

        {/* Row Sections Layout */}
        {rowSections.length > 0 && (
          <div className="mb-12 space-y-12">
            {/* Row Sections */}
            {rowSections.map((section, index) => (
              <div
                key={index}
                className="border-border border-b pb-8 last:border-b-0"
              >
                {!section['hide-title'] && section.title && (
                  <h4 className="text-foreground mb-6 text-lg font-semibold">
                    {section.href ? (
                      <a
                        href={section.href}
                        className="hover:text-primary transition-colors duration-200"
                      >
                        {section.title}
                      </a>
                    ) : (
                      section.title
                    )}
                  </h4>
                )}
                {renderSectionContent(section)}
              </div>
            ))}
          </div>
        )}

        {/* Global Metadata Section */}
        {globalMetadata && (
          <div className="border-border mt-12 flex flex-row items-center justify-between border-t pt-8 text-sm">
            <p className="text-muted-foreground">{globalMetadata.text}</p>
            <div className="flex flex-row justify-center gap-2">
              {globalMetadata.email && (
                <p className="text-muted-foreground text-sm">
                  <a
                    href={`mailto:${globalMetadata.email}`}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {globalMetadata.email}
                  </a>
                </p>
              )}
              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <SocialLink
                      key={index}
                      name={social.name}
                      href={social.href}
                      icon={social.icon}
                      showLabel
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
