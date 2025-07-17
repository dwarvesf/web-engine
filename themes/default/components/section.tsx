import { cn } from '../utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'accent' | 'muted' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  container?: boolean;
  fullWidth?: boolean;
  contentClassName?: string;
}

const variants = {
  default: 'bg-background',
  accent: 'bg-accent/5',
  muted: 'bg-alabaster',
  gradient: 'dwarves-gradient',
};

const sizes = {
  xs: '',
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
  xl: 'py-32',
};

export default function Section({
  children,
  className = '',
  id,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  style,
  contentClassName,
}: SectionProps) {
  const sectionClasses = cn(
    'relative',
    variants[variant],
    sizes[size],
    className,
  );

  const contentClasses = cn(
    {
      'dwarves-container': !fullWidth,
      'w-full': fullWidth,
    },
    contentClassName,
  );

  return (
    <section id={id} className={sectionClasses} style={style}>
      <div className={contentClasses}>{children}</div>
    </section>
  );
}
