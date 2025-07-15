import React from 'react';
import { cn } from '../../utils';

export default function Link({
  children,
  href,
  className = '',
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={cn(
        'text-foreground hover:text-primary-hover transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
