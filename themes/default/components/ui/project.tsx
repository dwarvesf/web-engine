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
  imageClassName?: string;
  customBackgroundColor?: string;
  customBorderColor?: string;
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
  imageClassName,
  customBackgroundColor,
  customBorderColor,
}: PropsWithChildren<ProjectProps>) {
  const getBackgroundClass = (bg?: string) => {
    switch (bg) {
      case 'green': // aharooms
        return 'bg-[#1F5934] border border-[#1F5934]';
      case 'yellow': //becorp
        return 'bg-[#f6c444] border border-[#f6c444]';
      case 'dark': // dental marketplace
        return 'bg-[#23252c] border border-[#23252c]';
      case 'purple': // naru
        return 'bg-[#7a03ed] border border-[#7a03ed]';
      case 'tertiary-blue': // kiwi
        return 'bg-[#2b64cf] border border-[#2b64cf]';
      case 'blue': // Attrace
        return 'bg-[#5299fd] border border-[#5299fd]';
      case 'white-blue': // airwatt
        return 'bg-[#F0F4F7] border border-[#F0F4F7]';
      case 'light-yellow': // artzy
        return 'bg-[#fff7e9] border border-[#fff7e9]';
      default:
        return 'bg-transparent border border-transparent';
    }
  };

  const getTextColor = (bg?: string) => {
    return ['dark', 'purple', 'blue', 'green', 'tertiary-blue'].includes(
      bg || '',
    )
      ? 'text-white hover:text-white'
      : 'text-black hover:text-black';
  };

  const baseClasses =
    'rounded-lg my-8 !mt-0 flex-1 max-h-[400px] overflow-hidden';

  if (featured || colored) {
    return (
      <Column
        className={cn(
          baseClasses,
          'justify-between pt-8 pb-8 sm:pb-0',
          customBackgroundColor ? '' : getBackgroundClass(background),
          getTextColor(background),
          colored && 'flex flex-col',
          className,
        )}
        style={{
          backgroundColor: customBackgroundColor,
          borderColor: customBorderColor,
        }}
      >
        <div className="not-prose relative max-w-none px-8">
          <div className="**:m-0">{children}</div>
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
            containerClassName={cn(
              'not-prose w-full align-middle',
              imageClassName,
            )}
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
        containerClassName={cn('block', imageClassName)}
      />
      <div className="prose max-w-none py-4 text-lg **:m-0">{children}</div>
    </div>
  );
}
