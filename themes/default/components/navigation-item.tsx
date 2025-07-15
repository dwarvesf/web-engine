import { useRef, useState } from 'react'; // Import useRef
import { cn } from '../utils';
import { Button, Icon, Tag } from './ui';
import { ButtonProps } from './ui/button';

type GroupItem = {
  group?: string;
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
                  <span className="text-foreground text-sm font-semibold uppercase">
                    {subGroup.group}
                  </span>
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
              <span className="text-foreground text-sm font-semibold uppercase">
                {group.group}
              </span>
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
          !tab?.type?.[0] ? 'text-foreground cursor-pointer !font-normal' : ''
        }
      >
        {tab.tab}
        {tab.tag && <Tag size="xs">{tab.tag}</Tag>}
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
          <NavigationDropDownContent
            groups={tab.groups!}
            onItemClick={onItemClick}
          />
        </div>
      )}
    </div>
  );
}
