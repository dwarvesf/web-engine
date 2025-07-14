import { cn } from '../utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'accent' | 'muted' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  container?: boolean;
  fullWidth?: boolean;
}

const variants = {
  default: 'bg-background',
  accent: 'bg-accent/5',
  muted: 'bg-muted/50',
  gradient: 'dwarves-gradient',
};

const sizes = {
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
}: SectionProps) {
  const sectionClasses = cn(
    'relative',
    variants[variant],
    sizes[size],
    className,
  );

  const contentClasses = cn({
    'dwarves-container': !fullWidth,
    'w-full': fullWidth,
  });

  return (
    <section id={id} className={sectionClasses} style={style}>
      <div className={contentClasses}>{children}</div>
    </section>
  );
}
