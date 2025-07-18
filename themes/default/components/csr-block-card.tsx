import React, { PropsWithChildren } from 'react';
import { cn } from '../utils';
import { Image } from './ui';

interface CSRBlockCardProps {
  className?: string;
  logoImg: string;
  logoAlt?: string;
  heroImg: string;
  heroAlt?: string;
}

const CSRBlockCard: React.FC<PropsWithChildren<CSRBlockCardProps>> = ({
  className,
  logoImg,
  heroImg,
  logoAlt = 'Image logo',
  heroAlt = 'Hero image',
  children,
}) => {
  return (
    <div className={cn('bg-secondary lg:flex', className)}>
      <div className="w-full px-12 py-12 lg:w-1/2 xl:px-18">
        <div className="mb-4 h-26">
          <Image
            src={logoImg}
            alt={logoAlt}
            className="h-full max-h-[104px] w-auto object-contain"
          />
        </div>
        {children}
      </div>
      <div className="hidden w-1/2 lg:block lg:min-h-[712px]">
        <Image
          src={heroImg}
          alt={heroAlt}
          className="h-full w-full flex-auto object-cover lg:min-h-[712px]"
        />
      </div>
    </div>
  );
};

export default CSRBlockCard;
