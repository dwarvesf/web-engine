import React from 'react';
import { cn } from '../../utils';

export default function Paragraph({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-foreground mb-4 leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
}
