import React from 'react';
import { cn } from '../../utils';

export default function Blockquote({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        'border-primary mt-4 mb-4 border-l-4 pl-4 italic',
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}
