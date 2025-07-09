import React from 'react';
import { cn } from '../lib/utils';

interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  [key: string]: any;
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
export const H1 = ({ children, ...props }: any) => (
  <Heading level={1} {...props}>
    {children}
  </Heading>
);

export const H2 = ({ children, ...props }: any) => (
  <Heading level={2} {...props}>
    {children}
  </Heading>
);

export const H3 = ({ children, ...props }: any) => (
  <Heading level={3} {...props}>
    {children}
  </Heading>
);

export const H4 = ({ children, ...props }: any) => (
  <Heading level={4} {...props}>
    {children}
  </Heading>
);

export const H5 = ({ children, ...props }: any) => (
  <Heading level={5} {...props}>
    {children}
  </Heading>
);

export const H6 = ({ children, ...props }: any) => (
  <Heading level={6} {...props}>
    {children}
  </Heading>
);
