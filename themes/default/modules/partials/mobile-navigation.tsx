'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn, transformSocialLinks } from '../../utils';
import { HeaderConfig, TabType } from '../../types/theme';
import { Icon, SocialLink } from '../../components';

interface Props {
  header: HeaderConfig;
}
// Components
export default function MobileNav({ header }: Props) {
  const mobileNavigationFooter = header['mobile-navigation-footer'];

  const items = header.navigation?.tabs || [];
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const onToggle = () => {
    setOpen(prev => !prev);
  };

  return (
    <>
      <button
        className="flex h-10 w-10 cursor-pointer items-center justify-center lg:hidden"
        aria-label="Toggle menu"
        onClick={onToggle}
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
            d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Overlay */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'bg-background fixed inset-0 top-18 z-50 m-auto flex flex-col overflow-auto transition-all duration-200 ease-[cubic-bezier(.22,.61,.36,1)] lg:hidden',
          open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-15',
        )}
      >
        <nav className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="min-h-0 w-full flex-1 overflow-y-auto py-4">
            <div className="dwarves-container min-h-0 w-full flex-1 overflow-visible">
              <NavList items={items} level={0} setOpen={setOpen} />
            </div>
          </div>

          {/* Social Links */}
          {mobileNavigationFooter && (
            <div className="px-5 py-4 sm:px-6" data-oid="tb96jwx">
              <div className="text-center" data-oid="4fq.qs2">
                <p
                  className="mb-4 text-xs tracking-widest text-gray-400 uppercase"
                  data-oid="a4qaiw8"
                >
                  Follow Us
                </p>
                {mobileNavigationFooter.socials && (
                  <div className="mb-4 flex items-center justify-center space-x-4">
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
                {mobileNavigationFooter.email && (
                  <>
                    <hr className="border-tag w-full border-t py-2" />
                    <a
                      href={`mailto:${mobileNavigationFooter.email}`}
                      className="text-muted-foreground text-sm"
                    >
                      <Icon
                        name="mail"
                        size="sm"
                        className="mr-2 inline-block"
                      />
                      {mobileNavigationFooter.email}
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

function NavList({
  items,
  level,
  setOpen,
}: {
  items: TabType[];
  level: number;
  setOpen: (open: boolean) => void;
}) {
  return (
    <ul
      className={cn(
        'space-y-1',
        level > 0 && 'border-alto/70 ml-3 border-l pl-3',
      )}
    >
      {items.map((item, idx) => (
        <li key={`${item.tab}-${idx}`}>
          <NavRow item={item} level={level} setOpen={setOpen} />
        </li>
      ))}
    </ul>
  );
}

function NavRow({
  item,
  level,
  setOpen,
}: {
  item: TabType;
  level: number;
  setOpen: (open: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const getGroups = useCallback((tabGroups: TabType['groups']) => {
    if (!tabGroups?.length) {
      return;
    }

    const results: TabType['groups'] = [];
    for (const group of tabGroups) {
      if (group.groups?.length) {
        const nestedGroups = getGroups(group.groups)!;
        if (group.group) {
          results.push({
            ...group,
            groups: nestedGroups,
          });
          continue;
        }

        for (const group of nestedGroups) {
          results.push(group);
        }
        continue;
      }

      results.push(group);
    }
    return results;
  }, []);

  const groups = getGroups(item.groups);

  const hasChildren = !!groups?.length;

  const renderButtonLink = (item: TabType) => {
    const hasLink = item.href;
    const action = hasLink
      ? () => setOpen(false)
      : hasChildren
        ? () => setExpanded(v => !v)
        : undefined;
    const Tag = item.href ? 'a' : 'button';
    if (item.type?.[0] === 'button') {
      return (
        <Tag
          href={item.href || '#'}
          onClick={action}
          className={cn(
            'hover:bg-primary/10 relative flex-1 cursor-pointer rounded-md px-3 py-3 text-base transition outline-none focus:outline-none',
            level === 0 ? 'font-medium' : 'font-normal',
            {
              'hover:bg-alto/40 opacity-70': !item.href && !hasChildren,
            },
          )}
        >
          {item.tab}
        </Tag>
      );
    }

    return (
      <Tag
        href={item.href || '#'}
        className={cn(
          'hover:bg-primary/10 relative flex-1 rounded-md px-3 py-3 text-left text-base transition outline-none focus:outline-none',
          level === 0 ? 'font-medium' : 'font-normal',
          {
            'hover:bg-alto/40 opacity-70': !item.href && !hasChildren,
          },
        )}
        onClick={action}
      >
        {item.tab}
        {item.tag && (
          <span className="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-1 text-xs">
            {item.tag}
          </span>
        )}
      </Tag>
    );
  };

  return (
    <div>
      <div className="group flex items-stretch">
        {renderButtonLink(item)}

        {hasChildren && (
          <button
            className="hover:bg-alabaster/10 mr-1 grid cursor-pointer place-items-center rounded-md px-2 transition outline-none focus:outline-none"
            onClick={() => setExpanded(v => !v)}
            aria-label={
              expanded ? `Collapse ${item.tab}` : `Expand ${item.tab}`
            }
          >
            {expanded ? (
              <Icon name="chevronDown" />
            ) : (
              <Icon name="chevronRight" />
            )}
          </button>
        )}
      </div>

      {hasChildren && (
        <div
          id={`section-${item.tab}`}
          className={cn(
            'overflow-hidden transition-[grid-template-rows,opacity] duration-200',
            expanded
              ? 'grid grid-rows-[1fr] opacity-100'
              : 'grid grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="min-h-0">
            <NavList
              items={groups!.map(
                g =>
                  ({
                    ...g,
                    tab: g.group ?? '',
                    groups:
                      g.groups ??
                      g.pages?.map(page => {
                        const [label, href] = Array.isArray(page)
                          ? page
                          : [page];
                        return {
                          group: label,
                          href,
                        };
                      }) ??
                      [],
                  }) as const,
              )}
              level={level + 1}
              setOpen={setOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}
