interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterProps {
  logo?: string;
  logoText?: string;
  description?: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  copyright?: string;
  className?: string;
}

export default function Footer({
  logo,
  logoText = 'Dwarves Foundation',
  description,
  sections,
  socialLinks,
  copyright,
  className = '',
}: FooterProps) {
  return (
    <footer
      className={`bg-secondary-background border-border border-t ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              {logo && <img src={logo} alt={logoText} className="h-8 w-auto" />}
              <span className="text-foreground text-xl font-bold">
                {logoText}
              </span>
            </div>
            {description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {description}
              </p>
            )}
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="text-foreground mb-4 font-semibold">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-border mt-8 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {copyright ||
              `© ${new Date().getFullYear()} ${logoText}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
