import { cn } from '../../utils';
import { SocialLink } from '../../components';
import { Logo } from '../../components/ui';

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

  const sections = footer.sections || footer['column-sections'] || [];
  const socialLinks = transformSocialLinks(footer.global?.socials || {});
  const copyright = footer.global?.text;
  const email = footer.global?.email;
  return (
    <footer className={cn('bg-background border-border border-t', className)}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="mb-4">
              <Logo text="Dwarves Foundation" />
            </div>
            {email && (
              <p className="text-muted-foreground mb-6 text-sm">
                <a
                  href={`mailto:${email}`}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {email}
                </a>
              </p>
            )}
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <SocialLink
                  key={index}
                  name={social.name}
                  href={social.href}
                  icon={social.icon}
                />
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
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
              <ul className="space-y-2">
                {section.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {section.tabs?.map((tab, tabIndex) => (
                  <li key={tabIndex}>
                    <a
                      href={tab.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
                    >
                      {tab.tab}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-border mt-12 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {copyright ||
              `© ${new Date().getFullYear()} Dwarves Foundation. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
