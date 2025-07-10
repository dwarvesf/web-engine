import { useRef, useState } from 'react'; // Import useRef
import { cn } from '../utils';
import { Icon } from './ui';

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
interface NavigationItemProps {
  tab: TabType;
  isMobile?: boolean;
  onItemClick?: () => void;
  alignRight?: boolean; // New prop for alignment
}

export default function NavigationItem({
  tab,
  isMobile = false,
  onItemClick,
  alignRight = false, // Default to false
}: NavigationItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for timeout
  const hasGroups = tab.groups && tab.groups.length > 0;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100); // 100ms delay
  };

  const handleClick = () => {
    if (hasGroups && isMobile) {
      setIsOpen(!isOpen);
    } else if (onItemClick) {
      onItemClick();
    }
  };

  const renderPage = (page: string | [string, string], index: number) => {
    const [label, href] = Array.isArray(page)
      ? page
      : [page, `#${page.toLowerCase().replace(/\s+/g, '-')}`];

    return (
      <a
        key={index}
        href={href}
        className={cn(
          'text-foreground hover:bg-secondary hover:text-primary block px-4 py-2 transition-colors duration-200',
        )}
        onClick={onItemClick}
      >
        {label}
      </a>
    );
  };

  if (isMobile) {
    return (
      <div className="py-2">
        <div className="flex items-center justify-between">
          <a
            href={tab.href || '#'}
            className={cn(
              'text-foreground hover:text-primary block font-medium transition-colors duration-200',
            )}
            onClick={onItemClick}
          >
            {tab.tab}
            {tab.tag && (
              <span className="bg-primary ml-2 rounded-full px-2 py-1 text-xs text-white">
                {tab.tag}
              </span>
            )}
          </a>
          {hasGroups && (
            <button
              onClick={handleClick}
              className={cn(
                'text-foreground hover:text-primary transition-colors duration-200',
              )}
            >
              <Icon
                name="chevronDown"
                size="sm"
                className={cn(
                  'transform transition-transform',
                  isOpen ? 'rotate-180' : '',
                )}
              />
            </button>
          )}
        </div>
        {hasGroups && isOpen && (
          <div className="mt-2 space-y-2 pl-4">
            {tab.groups!.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4">
                <div className="mb-2 flex items-center">
                  <span className="text-muted-foreground text-sm font-semibold">
                    {group.group}
                  </span>
                  {group.tag && (
                    <span className="bg-secondary ml-2 rounded-full px-2 py-1 text-xs">
                      {group.tag}
                    </span>
                  )}
                </div>
                <div className="space-y-1 pl-2">
                  {group.pages.map((page, pageIndex) =>
                    renderPage(page, pageIndex),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative">
      <a
        href={tab.href || '#'}
        className={cn(
          'text-foreground hover:text-primary flex items-center font-medium transition-colors duration-200',
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {tab.tab}
        {tab.tag && (
          <span className="bg-primary ml-2 rounded-full px-2 py-1 text-xs text-white">
            {tab.tag}
          </span>
        )}
        {hasGroups && <Icon name="chevronDown" size="sm" className="ml-1" />}
      </a>
      {hasGroups && isOpen && (
        <div
          className={cn(
            'bg-background border-border absolute top-full z-50 mt-2 w-80 rounded-lg border py-4 shadow-lg',
            alignRight ? 'right-0' : 'left-0', // Conditional positioning
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-2 gap-6 px-4">
            {tab.groups!.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="mb-3 flex items-center">
                  <span className="text-foreground text-sm font-semibold">
                    {group.group}
                  </span>
                  {group.tag && (
                    <span className="bg-secondary ml-2 rounded-full px-2 py-1 text-xs">
                      {group.tag}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {group.pages.map((page, pageIndex) =>
                    renderPage(page, pageIndex),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
