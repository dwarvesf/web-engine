import { cn } from '../lib/utils';

interface LinkProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  [key: string]: any;
}

export default function Link({
  children,
  href,
  className = '',
  ...props
}: LinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'text-primary hover:text-primary-hover underline transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
