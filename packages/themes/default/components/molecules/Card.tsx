import { cn } from '../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  href?: string;
}

export default function Card({
  children,
  className = '',
  title,
  href,
}: CardProps) {
  const CardWrapper = href ? 'a' : 'div';

  return (
    <CardWrapper
      href={href}
      className={cn(
        'bg-card border-border hover:bg-card-hover rounded-lg border p-6 transition-colors duration-200',
        className,
      )}
    >
      {title && (
        <h3 className="text-foreground mb-3 text-lg font-semibold">{title}</h3>
      )}
      <div className="prose prose-sm max-w-none">{children}</div>
    </CardWrapper>
  );
}
