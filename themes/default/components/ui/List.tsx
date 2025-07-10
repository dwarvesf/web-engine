import React from 'react';
import { cn } from '../../utils';

export function UnorderedList({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('mb-4 list-inside list-disc space-y-1', className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export function OrderedList({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn('mb-4 list-inside list-decimal space-y-1', className)}
      {...props}
    >
      {children}
    </ol>
  );
}

export function ListItem({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn('text-foreground', className)} {...props}>
      {children}
    </li>
  );
}

export default UnorderedList;
