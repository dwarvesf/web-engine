import React from 'react';
import { cn } from '../../utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'default' | 'gradient' | 'muted' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  spacing?: 'tight' | 'normal' | 'loose';
  balance?: boolean;
}

const headingClasses = {
  1: 'text-4xl md:text-4xl lg:text-5xl font-bold leading-tight',
  2: 'text-3xl md:text-3xl lg:text-4xl font-bold leading-tight',
  3: 'text-2xl md:text-2xl lg:text-3xl font-semibold leading-snug',
  4: 'text-xl md:text-xl lg:text-2xl font-semibold leading-snug',
  5: 'text-lg md:text-lg lg:text-xl font-medium leading-normal',
  6: 'text-base md:text-base lg:text-xl font-medium leading-normal',
};

const variants = {
  default: 'text-foreground',
  gradient: 'dwarves-text-gradient',
  muted: 'text-muted-foreground',
  accent: 'text-primary',
};

const sizes = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
  xxl: 'text-3xl',
};

const weights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const spacings = {
  tight: 'leading-tight',
  normal: 'leading-normal',
  loose: 'leading-loose',
};

export default function Heading({
  children,
  level,
  variant = 'default',
  size,
  weight,
  align = 'left',
  spacing,
  balance = false,
  className = '',
  ...props
}: HeadingProps) {
  const classes = cn(
    'dwarves-heading',
    size ? sizes[size] : headingClasses[level],
    weight ? weights[weight] : '',
    variants[variant],
    alignments[align],
    spacing ? spacings[spacing] : '',
    balance && 'dwarves-text-balance',
    className,
  );

  return React.createElement(
    `h${level}`,
    { className: classes, ...props },
    children,
  );
}

// Individual heading components
export const H1 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <Heading {...props} level={1}>
    {children}
  </Heading>
);

export const H2 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <Heading {...props} level={2}>
    {children}
  </Heading>
);

export const H3 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <Heading {...props} level={3}>
    {children}
  </Heading>
);

export const H4 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <Heading {...props} level={4}>
    {children}
  </Heading>
);

export const H5 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <Heading {...props} level={5}>
    {children}
  </Heading>
);

export const H6 = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <Heading {...props} level={6}>
    {children}
  </Heading>
);
