import React from 'react';
import { cn } from '../../utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const headingClasses = {
  1: 'text-foreground mb-4 text-3xl font-bold',
  2: 'text-foreground mt-8 mb-3 text-2xl font-bold',
  3: 'text-foreground mt-6 mb-2 text-xl font-semibold',
  4: 'text-foreground mt-4 mb-2 text-lg font-semibold',
  5: 'text-foreground mt-4 mb-2 text-base font-semibold',
  6: 'text-foreground mt-4 mb-2 text-sm font-semibold',
};

export default function Heading({
  children,
  level,
  className = '',
  ...props
}: HeadingProps) {
  const classes = cn(headingClasses[level], className);

  return React.createElement(
    `h${level}`,
    { className: classes, ...props },
    children,
  );
}

// Individual heading components
export const H1 = ({ children, ...props }: HeadingProps) => (
  <Heading {...props} level={1}>
    {children}
  </Heading>
);

export const H2 = ({ children, ...props }: HeadingProps) => (
  <Heading {...props} level={2}>
    {children}
  </Heading>
);

export const H3 = ({ children, ...props }: HeadingProps) => (
  <Heading {...props} level={3}>
    {children}
  </Heading>
);

export const H4 = ({ children, ...props }: HeadingProps) => (
  <Heading {...props} level={4}>
    {children}
  </Heading>
);

export const H5 = ({ children, ...props }: HeadingProps) => (
  <Heading {...props} level={5}>
    {children}
  </Heading>
);

export const H6 = ({ children, ...props }: HeadingProps) => (
  <Heading {...props} level={6}>
    {children}
  </Heading>
);
