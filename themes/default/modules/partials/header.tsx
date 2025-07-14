import { useState, useEffect } from 'react';
import { cn, transformSocialLinks } from '../../utils';
import { NavigationItem, SocialLink } from '../../components';
import { Icon, Logo } from '../../components/ui';
import { SocialConfig } from '../../types/theme';

interface TabType {
  tab: string;
  href?: string;
  type?: string[] | string;
  tag?: string;
  groups?: {
    group: string;
    tag?: string;
    pages: (string | [string, string])[];
  }[];
}

interface LogoConfig {
  src: string;
  alt: string;
  href: string;
}

interface NavigationConfig {
  position?: 'header' | 'aside';
  tabs: TabType[];
}

interface HeaderConfig {
  logo: LogoConfig;
  navigation: NavigationConfig;
  'mobile-navigation-footer'?: {
    email?: string;
    socials?: SocialConfig;
  };
}

interface HeaderProps {
  navigation?: NavigationConfig;
  header?: HeaderConfig;
  className?: string;
}

export default function Header({
  header,
  navigation,
  className = '',
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!header) return null;

  const mobileNavigationFooter = header['mobile-navigation-footer'];

  const { logo } = header;
  const items = navigation?.tabs || [];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <header
      className={cn(
        'bg-background sticky top-0 z-50 border-b transition-all duration-200 ease-in-out',
        { 'border-transparent': !isScrolled, 'border-border': isScrolled },
        className,
      )}
    >
      <div className="dwarves-container mx-auto py-2">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Logo
              src={logo?.src}
              text={logo?.alt}
              href={logo?.href}
              size="lg"
            />
          </div>

          {/* Navigation */}
          {items.length > 0 && (
            <nav className="hidden items-center space-x-1 lg:flex">
              {items.map((item, index) => (
                <NavigationItem key={index} tab={item} />
              ))}
            </nav>
          )}

          {/* Mobile menu button */}
          <button
            className="flex h-10 w-10 cursor-pointer items-center justify-center lg:hidden"
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            <svg
              className="h-8 w-8 font-bold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'bg-background fixed inset-0 top-18 z-50 m-auto flex flex-col overflow-auto transition-all duration-200 ease-[cubic-bezier(.22,.61,.36,1)] lg:hidden',
            isMobileMenuOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-15',
          )}
        >
          <nav className="flex flex-grow flex-col justify-center gap-4">
            {items.map((item, index) => (
              <NavigationItem
                key={index}
                tab={item}
                isMobile={true}
                onItemClick={closeMobileMenu}
              />
            ))}
          </nav>
          {/* Mobile navigation footer */}
          {mobileNavigationFooter && (
            <div className="flex flex-col items-center justify-center gap-2 p-4">
              {mobileNavigationFooter.socials && (
                <div className="mb-4 flex space-x-4">
                  {transformSocialLinks(mobileNavigationFooter.socials).map(
                    ({ name, href, icon }, index) => (
                      <SocialLink
                        key={index}
                        name={name}
                        href={href}
                        icon={icon}
                      />
                    ),
                  )}
                </div>
              )}
              <hr className="border-tag w-full border-t py-2" />
              {mobileNavigationFooter.email && (
                <a
                  href={`mailto:${mobileNavigationFooter.email}`}
                  className="text-muted-foreground text-sm"
                >
                  <Icon name="mail" size="sm" className="mr-2 inline-block" />
                  {mobileNavigationFooter.email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
