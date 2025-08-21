import { useState, useEffect } from 'react';
import { cn } from '../../utils';
import { NavigationItem } from '../../components';
import { Logo } from '../../components/ui';
import { HeaderConfig } from '../../types/theme';
import MobileNav from './mobile-navigation';

interface HeaderProps {
  navigation?: HeaderConfig['navigation'];
  header?: HeaderConfig;
  className?: string;
}

export default function Header({
  header,
  navigation,
  className = '',
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!header) return null;

  const { logo } = header;
  const items = navigation?.tabs ?? [];

  return (
    <header
      className={cn(
        'bg-background transition-border sticky top-0 z-50 border-b duration-200 ease-in-out',
        { 'border-transparent': !isScrolled, 'border-border': isScrolled },
        className,
      )}
    >
      <div className="dwarves-container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-center py-5">
            <Logo
              src={logo?.src}
              text={logo?.alt}
              href={logo?.href}
              size="lg"
            />
          </div>

          {/* Navigation */}
          {items?.length > 0 && (
            <nav className="hidden items-center space-x-6 lg:flex">
              {items.map((item, index) => (
                <NavigationItem key={index} tab={item} />
              ))}
            </nav>
          )}

          {/* Mobile menu button */}
          <MobileNav header={header} />
        </div>
      </div>
    </header>
  );
}
