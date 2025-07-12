import { PropsWithChildren } from 'react';
import { cn } from '../utils';
import { Button, H1, Paragraph } from './ui';
import Section from './section';

interface HeroProps {
  title: string;
  breakTitle?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  className?: string;
}

export default function Hero({
  title,
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
      className={cn(
        'relative flex space-y-4 overflow-hidden px-0 py-24',
        className,
      )}
      fullWidth
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 space-y-4">
        {subtitle && (
          <Paragraph className="text-muted-foreground text-md mb-8 font-bold uppercase">
            {subtitle}
          </Paragraph>
        )}
        <H1 className="text-foreground mb-8 leading-tight font-bold whitespace-pre-line">
          {/* Break title */}
          {title.replace(/\\n/g, '\n')}
        </H1>
        {description && (
          <Paragraph className="text-foreground mb-8 text-lg leading-relaxed whitespace-pre-line">
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
