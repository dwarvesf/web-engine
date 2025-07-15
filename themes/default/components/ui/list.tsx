import React, { isValidElement, JSX } from 'react';
import { cn } from '../../utils';

export function UnorderedList({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('mb-4 ml-5 list-outside list-disc space-y-1', className)}
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
      className={cn('mb-4 ml-5 list-outside list-decimal space-y-1', className)}
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
      {React.Children.map(children, child => {
        if (isValidElement(child)) {
          // Clone the child to ensure it can accept className and other props
          return React.cloneElement<HTMLElement>(child as JSX.Element, {
            className: cn(
              'inline',
              (child.props as React.HTMLProps<HTMLElement>).className,
            ),
          });
        }
        return child;
      })}
    </li>
  );
}

export default UnorderedList;
