import React from 'react';
import { cn } from '../../utils';

export default function Paragraph({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('leading-relaxed', className)}
      {...props}
      suppressHydrationWarning
    >
      {children}
    </p>
  );
}
