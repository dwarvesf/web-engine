import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'gradient'
    | 'danger'
    | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const variants = {
  primary:
    'bg-primary text-primary-foreground dwarves-button-transition dwarves-shadow',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
  outline:
    'border border-primary text-primary hover:bg-primary hover:border-primary hover:text-primary-foreground dwarves-button-transition',
  ghost:
    'text-primary hover:bg-primary/10 hover:text-primary-hover dwarves-highlight-on-hover',
  link: 'text-primary hover:text-primary-hover p-0',
  gradient:
    'dwarves-gradient text-primary-foreground hover:opacity-90 dwarves-button-transition shadow-lg',
  danger: 'bg-error text-white hover:bg-error/90 dwarves-button-transition',
  success:
    'bg-success text-white hover:bg-success/90 dwarves-button-transition',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

const roundedOptions = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
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
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      rounded = 'sm',
      ...props
    },
    ref,
  ) => {
    const baseClasses = cn(
      'cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-normal focus:outline-none dwarves-focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden',
      roundedOptions[rounded],
      fullWidth && 'w-full',
      loading && 'cursor-not-allowed',
    );

    const classes = cn(baseClasses, variants[variant], sizes[size], className);

    const renderContent = () => (
      <>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-current opacity-20">
            <div className="dwarves-loading-spin h-4 w-4 rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}
        <div className={cn('flex items-center gap-2', loading && 'opacity-50')}>
          {icon && iconPosition === 'left' && (
            <span className="shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="shrink-0">{icon}</span>
          )}
        </div>
      </>
    );

    if (href) {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <a href={href} className={classes} target={target} {...props}>
          {renderContent()}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={loading || props.disabled}
        {...props}
      >
        {renderContent()}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
