import { useRef, useState, useEffect } from 'react'; // Import useRef, useEffect
import { cn } from '../utils';
import { Button, Tag } from './ui';
import { ButtonProps } from './ui/button';

type GroupItem = {
  group?: string;
  href?: string;
  tag?: string;
  pages?: (string | [string, string])[];
  groups?: GroupItem[];
};

interface TabType {
  tab: string;
  href?: string;
  type?: string[] | string;
  tag?: string;
  groups?: GroupItem[];
}
interface NavigationItemProps {
  tab: TabType;
  isMobile?: boolean;
  onItemClick?: () => void;
  trigger?: 'hover' | 'click';
}

export const NavigationDropDownContent: React.FC<{
  groups: NonNullable<TabType['groups']>;
  onItemClick?: () => void;
  className?: string;
}> = ({ groups, onItemClick, className }) => {
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

  function renderGroup(group: GroupItem) {
    if (group.href) {
      return (
        <a
          href={group.href}
          className="text-foreground text-sm font-semibold uppercase"
        >
          {group.group}
        </a>
      );
    }

    return (
      <span className="text-foreground text-sm font-semibold uppercase">
        {group.group}
      </span>
    );
  }
  return (
    <div
      className={cn(
        'dwarves-container mx-auto grid grid-cols-4 gap-6 pt-6 pb-8',
        className,
      )}
    >
      {groups!.map((group, groupIndex) =>
        group.groups ? (
          <div key={groupIndex} className="flex flex-col gap-8">
            {group.groups.map((subGroup, subGroupIndex) => (
              <div key={subGroupIndex}>
                <div className="mb-3 flex items-center gap-1">
                  {renderGroup(subGroup)}
                  {subGroup.tag && <Tag size="xs">{subGroup.tag}</Tag>}
                </div>
                <div>
                  {subGroup.pages?.map((page, pageIndex) =>
                    renderPage(page, pageIndex),
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div key={groupIndex}>
            <div className="mb-3 flex items-center gap-1">
              {renderGroup(group)}
              {group.tag && <Tag size="xs">{group.tag}</Tag>}
            </div>
            <div>
              {group.pages?.map((page, pageIndex) =>
                renderPage(page, pageIndex),
              )}
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default function NavigationItem({
  tab,
  isMobile = false,
  onItemClick,
  trigger = 'click',
}: NavigationItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for timeout
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown content
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref for the button that opens the dropdown
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center">
        {tab.type?.[0] === 'button' ? (
          <Button
            href={tab.href || '#'}
            onClick={onItemClick}
            variant={(tab.type?.[1] || 'primary') as ButtonProps['variant']}
            className="cursor-pointer text-lg"
          >
            {tab.tab}
          </Button>
        ) : (
          <Button
            variant="link"
            href={tab.href || '#'}
            className={cn(
              'text-foreground hover:text-primary text-lg transition-colors duration-200',
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
        ref={buttonRef} // Attach ref to the button
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
        className={
          !tab?.type?.[0]
            ? 'text-foreground cursor-pointer !px-2 !font-normal'
            : ''
        }
      >
        {tab.tab}
        {tab.tag && <Tag size="xs">{tab.tag}</Tag>}
        {hasGroups && (
          <svg
            fill="currentColor"
            preserveAspectRatio="xMidYMid meet"
            height="20"
            width="20"
            viewBox="0 0 40 40"
            className={cn('transform', {
              'rotate-180': isOpen,
            })}
          >
            <g>
              <path d="m31 12.5l1.5 1.6-12.5 13.4-12.5-13.4 1.5-1.6 11 11.7z"></path>
            </g>
          </svg>
        )}
      </Button>
      {hasGroups && isOpen && (
        <div
          ref={dropdownRef} // Attach ref to the dropdown content
          className={cn(
            'bg-background border-alto fixed top-20 right-0 left-0 overflow-hidden border-b shadow-lg',
          )}
          {...(trigger === 'hover'
            ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
            : {})}
        >
          <NavigationDropDownContent
            groups={tab.groups!}
            onItemClick={onItemClick}
          />
        </div>
      )}
    </div>
  );
}
