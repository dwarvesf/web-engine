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

export const HighlightedLink: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ children, href, className = '', ...props }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "before:bg-primary relative z-10 inline-block before:absolute before:bottom-0.5 before:left-0 before:-z-10 before:h-1 before:w-full before:content-['']",
      className,
    )}
    {...props}
  >
    {children}
  </a>
);
