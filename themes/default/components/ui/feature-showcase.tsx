import React from 'react';
import { cn } from '../../utils';
import Image from './image';

interface FeatureShowcaseProps {
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  title: string;
  description: React.ReactNode;
  link: {
    href: string;
    text: string;
  };
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  reversed?: boolean;
  className?: string;
}

export default function FeatureShowcase({
  logo,
  title,
  description,
  link,
  image,
  reversed = false,
  className = '',
}: FeatureShowcaseProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between',
        reversed ? 'md:flex-row-reverse' : 'md:flex-row',
        className,
      )}
    >
      <div className="flex w-full flex-col justify-center py-6 md:w-5/12">
        <div className="mb-4">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-19 w-auto"
          />
        </div>
        <strong className="my-4 inline-block text-2xl font-semibold">
          {title}
        </strong>
        <div className="text-foreground text-xl whitespace-pre-line">
          {description}
        </div>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-hover mt-6 inline-flex items-center text-lg font-medium transition-colors"
        >
          {link.text}
          <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
      <div className={cn('w-full md:w-1/2')}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-[560px] w-full object-cover"
        />
      </div>
    </div>
  );
}
