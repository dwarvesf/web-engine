import { cn } from '../../utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-tag text-tag-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
};

const sizes = {
  xs: 'px-2 py-0 text-[8px]',
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Tag({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}: TagProps) {
  const baseClasses = 'inline-block rounded-full font-semibold uppercase';
  const classes = cn(baseClasses, variants[variant], sizes[size], className);

  return <span className={classes}>{children}</span>;
}
