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
  container = true,
  fullWidth = true,
  style,
}: SectionProps) {
  const sectionClasses = cn(
    'relative',
    variants[variant],
    sizes[size],
    className,
  );

  const contentClasses = cn(
    container && !fullWidth && 'container mx-auto px-4',
    fullWidth && 'w-full',
  );

  return (
    <section id={id} className={sectionClasses} style={style}>
      <div className={contentClasses}>{children}</div>
    </section>
  );
}
