import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
}

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

const variants = {
  default: 'bg-input border border-border focus:border-primary',
  filled: 'bg-secondary border border-transparent focus:border-primary',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      variant = 'default',
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const baseClasses =
      'w-full rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      error ? 'border-red-500' : '',
      className,
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-foreground mb-2 block text-sm font-medium"
          >
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={classes} {...props} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-muted-foreground mt-1 text-sm">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
