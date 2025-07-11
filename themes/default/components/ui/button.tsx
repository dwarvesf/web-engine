import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  children: React.ReactNode;
  target?: string; // Optional target prop for links
}

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-primary text-primary hover:bg-primary-hover hover:border-primary-hover hover:text-white',
  ghost: 'text-primary hover:bg-primary-hover hover:text-primary-foreground',
  link: 'text-primary hover:text-primary-hover hover:underline focus:ring-0 focus:ring-offset-0',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      href,
      className = '',
      children,
      target,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const classes = cn(baseClasses, variants[variant], sizes[size], className);

    if (href) {
      return (
        <a href={href} className={classes} target={target}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
