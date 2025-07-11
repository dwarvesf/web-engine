import { cn } from '../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  href?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  loading?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  image?: React.ReactNode;
}

const variants = {
  default: 'bg-card border border-border hover:bg-card-hover',
  elevated: 'bg-card shadow-lg hover:shadow-xl dwarves-hover-lift',
  outlined:
    'bg-transparent border-2 border-border hover:border-primary hover:bg-card/50',
  ghost: 'bg-transparent hover:bg-card/50 dwarves-highlight-on-hover',
  gradient: 'dwarves-gradient text-primary-foreground border-0',
};

const sizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export default function Card({
  children,
  className = '',
  title,
  href,
  variant = 'default',
  size = 'md',
  hover = false,
  loading = false,
  onClick,
  icon,
  badge,
  footer,
  image,
}: CardProps) {
  const CardWrapper = href ? 'a' : onClick ? 'button' : 'div';

  const cardClasses = cn(
    'relative rounded-lg transition-all',
    variants[variant],
    sizes[size],
    hover && 'dwarves-card-hover',
    loading && 'cursor-not-allowed opacity-50',
    onClick && 'cursor-pointer',
    className,
  );

  const renderContent = () => (
    <>
      {loading && (
        <div className="bg-card/80 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="dwarves-loading-spin border-primary h-6 w-6 rounded-full border-2 border-t-transparent" />
        </div>
      )}

      {badge && <div className="absolute top-4 right-4 z-10">{badge}</div>}

      {image && (
        <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
          {image}
        </div>
      )}

      <div className="space-y-4">
        {(title || icon) && (
          <div className="flex items-start gap-3">
            {icon && <div className="mt-1 flex-shrink-0">{icon}</div>}
            {title && (
              <h3 className="text-foreground dwarves-heading text-lg leading-tight font-semibold">
                {title}
              </h3>
            )}
          </div>
        )}

        <div className="prose prose-sm dwarves-body max-w-none">{children}</div>
      </div>

      {footer && (
        <div className="border-border mt-6 border-t pt-4">{footer}</div>
      )}
    </>
  );

  return (
    <CardWrapper
      href={href}
      onClick={onClick}
      className={cardClasses}
      disabled={loading}
      {...(onClick && { type: 'button' })}
    >
      {renderContent()}
    </CardWrapper>
  );
}
