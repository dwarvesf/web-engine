import { useState } from 'react';
import { cn } from '../../utils';
import { NavigationItem } from '../../components';
import { Logo } from '../../components/ui';

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
}

interface HeaderProps {
  header?: HeaderConfig;
  className?: string;
}

export default function Header({ header, className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!header) return null;

  const { logo, navigation } = header;
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
        'bg-background border-border sticky top-0 z-50 border-b',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-8">
          {/* Logo */}
          <div className="flex items-center">
            <Logo src={logo?.src} text={logo?.alt} href={logo?.href} />
          </div>

          {/* Navigation */}
          {items.length > 0 && (
            <nav className="hidden items-center space-x-8 md:flex">
              {items.map((item, index) => (
                <NavigationItem key={index} tab={item} />
              ))}
            </nav>
          )}

          {/* Mobile menu button */}
          <button
            className="border-border hover:bg-secondary flex h-10 w-10 items-center justify-center rounded-md border transition-colors md:hidden"
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            <svg
              className="h-5 w-5"
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
        {isMobileMenuOpen && (
          <div className="border-border border-t md:hidden">
            <div className="space-y-4 px-4 py-6">
              {items.map((item, index) => (
                <NavigationItem
                  key={index}
                  tab={item}
                  isMobile={true}
                  onItemClick={closeMobileMenu}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
