import React from 'react';
import { cn } from '../../utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'lead' | 'large' | 'small' | 'muted' | 'code';
  size?:
    | 'xs'
    | 'sm'
    | 'base'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'default' | 'primary' | 'muted' | 'accent' | 'gradient';
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
  as?: React.ElementType;
  balance?: boolean;
  pretty?: boolean;
}

const variants = {
  lead: 'text-lg leading-relaxed font-medium text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
  code: 'text-sm font-mono bg-muted px-2 py-1 rounded border',
};

const sizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
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
  justify: 'text-justify',
};

const colors = {
  default: 'text-foreground',
  primary: 'text-primary',
  muted: 'text-muted-foreground',
  accent: 'text-primary',
  gradient: 'dwarves-text-gradient',
};

const spacings = {
  tight: 'leading-tight',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
};

const defaultElements = {
  lead: 'p' as const,
  large: 'div' as const,
  small: 'small' as const,
  muted: 'p' as const,
  code: 'code' as const,
};

export default function Typography({
  children,
  variant = 'large',
  size,
  weight,
  align = 'left',
  color = 'default',
  spacing,
  as,
  balance = false,
  pretty = false,
  className = '',
  ...props
}: TypographyProps) {
  const Element = as || defaultElements[variant];

  const classes = cn(
    variants[variant],
    size && sizes[size],
    weight && weights[weight],
    alignments[align],
    colors[color],
    spacing && spacings[spacing],
    balance && 'dwarves-text-balance',
    pretty && 'dwarves-text-pretty',
    className,
  );

  return React.createElement(
    Element,
    { className: classes, ...props },
    children,
  );
}

export const TypographyLead = ({
  children,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="lead" {...props}>
    {children}
  </Typography>
);

export const TypographyLarge = ({
  children,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="large" {...props}>
    {children}
  </Typography>
);

export const TypographySmall = ({
  children,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="small" {...props}>
    {children}
  </Typography>
);

export const TypographyMuted = ({
  children,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="muted" {...props}>
    {children}
  </Typography>
);

export const TypographyCode = ({
  children,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="code" {...props}>
    {children}
  </Typography>
);
