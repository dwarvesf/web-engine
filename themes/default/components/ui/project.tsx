import { PropsWithChildren } from 'react';
import { cn } from '../../utils';
import Image from './image';
import { Column } from './flex';
import Button from './button';
import Icon from './icon';

interface ProjectProps {
  className?: string;
  featured?: boolean;
  colored?: boolean;
  background?: 'green' | 'yellow' | 'dark' | 'purple' | 'blue';
  image: string;
  imageAlt?: string;
  href?: string;
}

export default function Project({
  children,
  className,
  featured = false,
  colored = false,
  background,
  image,
  imageAlt = '',
  href,
}: PropsWithChildren<ProjectProps>) {
  const getBackgroundClass = (bg?: string) => {
    switch (bg) {
      case 'green':
        return 'bg-[#1F5934]';
      case 'yellow':
        return 'bg-[#f6c444]';
      case 'dark':
        return 'bg-[#23252c]';
      case 'purple':
        return 'bg-[#7a03ed]';
      case 'blue':
        return 'bg-[#5299fd]';
      case 'white-blue':
        return 'bg-[#F0F4F7]';
      default:
        return 'bg-white';
    }
  };

  const getTextColor = (bg?: string) => {
    return ['dark', 'purple', 'blue', 'green'].includes(bg || '')
      ? 'text-white'
      : 'text-black';
  };

  const baseClasses = 'rounded-lg my-8 !mt-0';

  if (featured || colored) {
    return (
      <Column
        className={cn(
          baseClasses,
          'justify-between pt-8 pb-8 sm:pb-0',
          getBackgroundClass(background),
          getTextColor(background),
          colored && 'flex flex-col',
          className,
        )}
      >
        <div className="not-prose relative max-w-none px-8">
          {children}
          {href ? (
            <Button
              variant="link"
              href={href}
              className={cn('absolute top-2 right-0', getTextColor(background))}
            >
              <Icon name="arrowRight" />
            </Button>
          ) : null}
        </div>
        <div className="hidden sm:block">
          <Image
            src={image}
            alt={imageAlt}
            objectFit="contain"
            className="not-prose w-full align-middle"
          />
        </div>
      </Column>
    );
  }

  return (
    <div className={cn(baseClasses, className)}>
      <Image
        src={image}
        alt={imageAlt}
        className="not-prose flex h-10"
        containerClassName="block"
      />
      <div className="prose max-w-none py-4">{children}</div>
    </div>
  );
}
