import { Button } from '../atoms';

interface HeroProps {
  title: string;
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
}: HeroProps) {
  return (
    <section
      className={`relative flex min-h-screen items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="from-primary/10 to-primary/5 absolute inset-0 bg-gradient-to-br via-transparent" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {subtitle && (
          <p className="text-primary mb-4 text-sm font-medium tracking-wider uppercase">
            {subtitle}
          </p>
        )}
        <h1 className="text-foreground mb-6 text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            {description}
          </p>
        )}
        {ctaText && ctaLink && (
          <Button href={ctaLink} size="lg">
            {ctaText}
          </Button>
        )}
      </div>
    </section>
  );
}
