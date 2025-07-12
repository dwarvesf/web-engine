import React from 'react';
import { cn } from '../../utils';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  justify?:
    | 'start'
    | 'end'
    | 'center'
    | 'between'
    | 'around'
    | 'evenly'
    | 'stretch';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  grow?: boolean;
  shrink?: boolean;
  basis?: 'auto' | 'full' | 'fit' | 'max' | 'min';
  as?: React.ElementType;
  inline?: boolean;
}

const directions = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
};

const wraps = {
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
  nowrap: 'flex-nowrap',
};

const justifyContent = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
  stretch: 'justify-stretch',
};

const alignItems = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const gaps = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-10',
  '3xl': 'gap-12',
};

const flexBasis = {
  auto: 'basis-auto',
  full: 'basis-full',
  fit: 'basis-fit',
  max: 'basis-max',
  min: 'basis-min',
};

export default function Flex({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'md',
  grow = false,
  shrink = true,
  basis = 'auto',
  as = 'div',
  inline = false,
  className = '',
  ...props
}: FlexProps) {
  const Element = as;

  const classes = cn(
    inline ? 'inline-flex' : 'flex',
    directions[direction],
    wraps[wrap],
    justifyContent[justify],
    alignItems[align],
    gaps[gap],
    grow && 'flex-grow',
    !shrink && 'flex-shrink-0',
    basis !== 'auto' && flexBasis[basis],
    className,
  );

  return (
    <Element className={classes} {...props}>
      {children}
    </Element>
  );
}

export interface FlexItemProps extends React.HTMLAttributes<HTMLDivElement> {
  grow?: boolean | number;
  shrink?: boolean | number;
  basis?: string | number;
  order?: number;
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  as?: React.ElementType;
}

const alignSelfValues = {
  auto: 'self-auto',
  start: 'self-start',
  end: 'self-end',
  center: 'self-center',
  baseline: 'self-baseline',
  stretch: 'self-stretch',
};

export function FlexItem({
  children,
  grow = false,
  shrink = true,
  basis,
  order,
  alignSelf = 'auto',
  as = 'div',
  className = '',
  style,
  ...props
}: FlexItemProps) {
  const Element = as;

  const classes = cn(
    typeof grow === 'boolean' ? (grow ? 'flex-grow' : '') : `flex-grow-${grow}`,
    typeof shrink === 'boolean'
      ? shrink
        ? ''
        : 'flex-shrink-0'
      : `flex-shrink-${shrink}`,
    order && `order-${order}`,
    alignSelfValues[alignSelf],
    className,
  );

  const flexStyle = {
    ...(basis && { flexBasis: basis }),
    ...style,
  };

  return (
    <Element className={classes} style={flexStyle} {...props}>
      {children}
    </Element>
  );
}

export const Row = ({ children, ...props }: Omit<FlexProps, 'direction'>) => (
  <Flex direction="row" {...props}>
    {children}
  </Flex>
);

export const Column = ({
  children,
  ...props
}: Omit<FlexProps, 'direction'>) => (
  <Flex direction="col" {...props}>
    {children}
  </Flex>
);

export const Center = ({
  children,
  ...props
}: Omit<FlexProps, 'justify' | 'align'>) => (
  <Flex justify="center" align="center" {...props}>
    {children}
  </Flex>
);

export const Stack = ({
  children,
  gap = 'md',
  ...props
}: Omit<FlexProps, 'direction'>) => (
  <Flex direction="col" gap={gap} {...props}>
    {children}
  </Flex>
);

export const HStack = ({
  children,
  gap = 'md',
  ...props
}: Omit<FlexProps, 'direction'>) => (
  <Flex direction="row" gap={gap} {...props}>
    {children}
  </Flex>
);
