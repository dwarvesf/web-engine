import { cn } from '../../utils';
import { Button, SocialLink, Tag } from '../../components';
import React from 'react';
import { ButtonProps } from '../../components/ui/button';

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

  const renderTitle = (section: FooterSection) => {
    return (
      <>
        {!section['hide-title'] && section.title && (
          <h6 className="text-foreground text-md font-semibold">
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
          </h6>
        )}
      </>
    );
  };

  const renderMetaSection = (
    section: FooterSection,
    isHiddenSmallScreen = false,
  ) => {
    const isHasContentAndSocials = section.content?.length || section.socials;
    if (!isHasContentAndSocials) {
      return null;
    }
    return (
      <div
        className={cn(
          'col-span-2 space-y-2 lg:block',
          isHiddenSmallScreen && 'hidden',
        )}
      >
        {renderTitle(section)}
        {/* Render content and socials */}
        {section.content?.map((content, contentIndex) => (
          <div key={contentIndex} className="mb-2 block space-x-2">
            <h6 className="text-foreground text-md inline-block font-medium">
              {content.title}
            </h6>
            <p className="text-foreground text-md inline-block">
              {content.text}
            </p>
          </div>
        ))}
        {section.socials && (
          <div className="mt-8 flex space-x-4">
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
      </div>
    );
  };

  const renderSectionContent = (section: FooterSection) => {
    const isHasContentAndSocials = section.content?.length || section.socials;
    if (isHasContentAndSocials) {
      return renderMetaSection(section, true);
    }
    return (
      <div className="space-y-2">
        {renderTitle(section)}
        {/* Render links and tabs */}
        <ul className="space-y-2">
          {section.links?.map((link, linkIndex) => (
            <li key={linkIndex}>
              <a
                href={link.href}
                className="text-foreground hover:text-primary text-md transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
          {section.tabs?.map((tab, tabIndex) => (
            <li className="space-x-2" key={tabIndex}>
              <Button
                variant={(tab.type?.[0] || 'link') as ButtonProps['variant']}
                href={tab.href}
                className={cn(
                  'text-foreground hover:text-primary text-md px-0 py-0 transition-colors duration-200',
                  {
                    'text-primary font-semibold': tab.type?.[1] === 'primary',
                  },
                )}
              >
                {tab.tab}
              </Button>
              {tab.tag && (
                <Tag size="xs" variant="primary">
                  {tab.tag.toUpperCase()}
                </Tag>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer className={cn('bg-background pt-8', className)}>
      <div className="dwarves-container mx-auto space-y-8 py-4">
        {/* Column Sections Layout */}
        {columnSections.length > 0 && (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {/* Column Sections */}
            {columnSections.map((section, index) => (
              <React.Fragment key={index}>
                {renderSectionContent(section)}
              </React.Fragment>
            ))}
          </div>
        )}
        {columnSections.length > 0 && (
          <div className="block lg:hidden">
            {/* Column Meta Sections */}
            {columnSections.map((section, index) => (
              <React.Fragment key={index}>
                {renderMetaSection(section)}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Row Sections Layout */}
        {rowSections.length > 0 && (
          <div className="space-y-12">
            {/* Row Sections */}
            {rowSections.map((section, index) => (
              <div
                key={index}
                className="border-border border-b pb-8 last:border-b-0"
              >
                {renderSectionContent(section)}
              </div>
            ))}
          </div>
        )}
        {rowSections.length > 0 && (
          <div className="block lg:hidden">
            {/* Row Meta Sections */}
            {rowSections.map((section, index) => (
              <React.Fragment key={index}>
                {renderMetaSection(section)}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Global Metadata Section */}
        {globalMetadata && (
          <div className="border-border mt-4 grid grid-cols-1 items-center gap-4 border-t pt-4 text-sm sm:grid-cols-2">
            <p className="text-muted-foreground">{globalMetadata.text}</p>
            <div className="flex flex-row items-center gap-4 sm:justify-end sm:gap-2">
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
