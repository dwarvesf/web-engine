import { useState } from 'react';
import { Logo, Icon, Button, ThemeToggle } from '../atoms';
import { NavigationItem } from '../molecules';

interface LogoConfig {
  src: string;
  alt: string;
  href: string;
}

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

interface NavigationProps {
  logo?: LogoConfig;
  logoText?: string;
  tabs?: TabType[];
  position?: 'header' | 'aside';
  className?: string;
}

export default function Navigation({
  logo,
  logoText = 'Dwarves Foundation',
  tabs = [],
  position = 'header',
  className = '',
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAsidePosition = position === 'aside';

  const renderTabButton = (tab: TabType, index: number) => {
    if (tab.type && Array.isArray(tab.type) && tab.type.includes('button')) {
      const isPrimary = tab.type.includes('primary');
      return (
        <Button
          key={index}
          href={tab.href}
          variant={isPrimary ? 'primary' : 'secondary'}
          size="sm"
          className="flex-shrink-0"
        >
          {tab.tab}
          {tab.tag && (
            <span className="bg-primary ml-2 rounded-full px-2 py-1 text-xs text-white">
              {tab.tag}
            </span>
          )}
        </Button>
      );
    }

    return <NavigationItem key={index} tab={tab} isMobile={false} />;
  };

  if (isAsidePosition) {
    return (
      <aside
        className={`bg-background/95 border-border fixed left-0 top-0 z-50 h-full w-64 border-r backdrop-blur-sm ${className}`}
      >
        <div className="p-4">
          <div className="mb-8">
            <Logo
              src={logo?.src}
              alt={logo?.alt}
              href={logo?.href}
              text={logoText}
            />
          </div>

          <nav className="space-y-2">
            {tabs.map((tab, index) => (
              <div key={index} className="w-full">
                {renderTabButton(tab, index)}
              </div>
            ))}
            <div className="pt-4">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <nav
      className={`bg-background/95 border-border fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-sm ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo
            src={logo?.src}
            alt={logo?.alt}
            href={logo?.href}
            text={logoText}
          />

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {tabs.map((tab, index) => renderTabButton(tab, index))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              className="text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size="md" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-border border-t py-4 md:hidden">
            {tabs.map((tab, index) => (
              <NavigationItem
                key={index}
                tab={tab}
                isMobile
                onItemClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
