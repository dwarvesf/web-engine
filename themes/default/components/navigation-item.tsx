import { useRef, useState } from 'react'; // Import useRef
import { cn } from '../utils';
import { Button, Icon, Tag } from './ui';
import { ButtonProps } from './ui/button';

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
  trigger?: 'hover' | 'click';
}

export default function NavigationItem({
  tab,
  isMobile = false,
  onItemClick,
  trigger = 'click',
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

  const renderPage = (page: string | [string, string], index: number) => {
    const [label, href] = Array.isArray(page) ? page : [page];

    if (!href) {
      return (
        <span key={index} className="text-foreground text-md block px-0 py-1">
          {label}
        </span>
      );
    }

    return (
      <a
        key={index}
        href={href}
        className={cn(
          'text-foreground dwarves-link-navigation text-md relative block w-fit px-0 py-1',
        )}
        onClick={onItemClick}
      >
        {label}
      </a>
    );
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-center">
        {tab.type?.[0] === 'button' ? (
          <Button
            href={tab.href || '#'}
            onClick={onItemClick}
            variant={(tab.type?.[1] || 'primary') as ButtonProps['variant']}
            className="text-lg font-semibold"
          >
            {tab.tab}
          </Button>
        ) : (
          <Button
            variant="link"
            href={tab.href || '#'}
            className={cn(
              'text-foreground hover:text-primary text-lg font-semibold transition-colors duration-200',
            )}
            onClick={onItemClick}
          >
            {tab.tab}
            {tab.tag && (
              <span className="bg-primary ml-2 rounded-full px-2 py-1 text-xs text-white">
                {tab.tag}
              </span>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="group relative">
      <Button
        href={tab.href}
        {...(trigger === 'hover'
          ? {
              onMouseEnter: handleMouseEnter,
              onMouseLeave: handleMouseLeave,
            }
          : {
              onClick: () => {
                setIsOpen(!isOpen);
                if (onItemClick) onItemClick();
              },
            })}
        variant={
          tab.type?.[0] === 'button'
            ? (tab.type?.[1] as ButtonProps['variant']) || 'primary'
            : 'link'
        }
        className={!tab?.type?.[0] ? 'text-foreground' : ''}
      >
        {tab.tab}
        {tab.tag && <Tag>{tab.tag}</Tag>}
        {hasGroups && <Icon name="chevronDown" size="sm" className="ml-1" />}
      </Button>
      {hasGroups && isOpen && (
        <div
          className={cn(
            'bg-background border-alto fixed top-20 right-0 left-0 overflow-hidden border-b shadow-lg',
          )}
          {...(trigger === 'hover'
            ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
            : {})}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-4 gap-6 px-4 pt-6 pb-8">
            {tab.groups!.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-foreground text-sm font-semibold uppercase">
                    {group.group}
                  </span>
                  {group.tag && <Tag>{group.tag}</Tag>}
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
