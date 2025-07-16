import { PropsWithChildren } from 'react';
import { cn } from '../utils';
import { Button, H1, Paragraph } from './ui';
import Section from './section';

interface HeroProps {
  title: string;
  titleClassName?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  className?: string;
}

export default function Hero({
  title,
  titleClassName = '',
  subtitle,
  description,
  ctaText,
  ctaLink,
  backgroundImage,
  className = '',
  children,
}: PropsWithChildren<HeroProps>) {
  return (
    <Section
      className={cn('relative px-0 py-24', className)}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-paragraph relative z-10">
        {subtitle && (
          <Paragraph className="text-muted-foreground text-md mb-4 font-bold uppercase">
            {subtitle}
          </Paragraph>
        )}
        <H1
          className={cn(
            'text-foreground mb-6 leading-tight whitespace-pre-line',
            titleClassName,
          )}
        >
          {/* Break title */}
          {title?.replace(/\\n/g, '\n')}
        </H1>
        {description && (
          <Paragraph className="text-foreground max-w-paragraph mb-8 text-xl whitespace-pre-line">
            {description.replace(/\\n/g, '\n')}
          </Paragraph>
        )}
        {ctaText && ctaLink && (
          <Button href={ctaLink} size="md">
            {ctaText}
          </Button>
        )}
      </div>
      {children}
    </Section>
  );
}
