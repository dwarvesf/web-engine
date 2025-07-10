import React from 'react';
import { cn } from '../../utils';

export function CodeBlock({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn('bg-muted mb-4 overflow-x-auto rounded-lg p-4', className)}
      {...props}
    >
      {children}
    </pre>
  );
}

export function InlineCode({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn('bg-muted rounded px-2 py-1 text-sm', className)}
      {...props}
    >
      {children}
    </code>
  );
}

export default CodeBlock;
