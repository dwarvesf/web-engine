import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../utils';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined' | 'ghost';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  fullWidth?: boolean;
}

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

const variants = {
  default: 'dwarves-form-input',
  filled:
    'bg-secondary border border-transparent focus:border-primary hover:bg-secondary/80',
  outlined:
    'bg-transparent border-2 border-border focus:border-primary hover:border-border-hover',
  ghost: 'bg-transparent border-0 focus:bg-input/50 hover:bg-input/30',
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
      leftIcon,
      rightIcon,
      loading = false,
      success = false,
      fullWidth = true,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const hasIcons = leftIcon || rightIcon || loading || success;

    const baseClasses = cn(
      'rounded-lg transition-all duration-normal focus:outline-none',
      'placeholder:text-muted-foreground',
      fullWidth ? 'w-full' : '',
      hasIcons && leftIcon && 'pl-10',
      hasIcons && (rightIcon || loading || success) && 'pr-10',
    );

    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      error && 'border-error focus:border-error',
      success && 'border-success focus:border-success',
      props.disabled && 'opacity-50 cursor-not-allowed',
      className,
    );

    const containerClasses = cn(
      'relative',
      fullWidth ? 'w-full' : 'inline-block',
    );

    const iconClasses =
      'absolute top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4';

    return (
      <div className={fullWidth ? 'w-full space-y-2' : 'space-y-2'}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-foreground dwarves-subheading block text-sm font-medium"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className={containerClasses}>
          {leftIcon && (
            <div className={cn(iconClasses, 'left-3')}>{leftIcon}</div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={classes}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {(rightIcon || loading || success) && (
            <div className={cn(iconClasses, 'right-3')}>
              {loading && (
                <div className="dwarves-loading-spin h-4 w-4 rounded-full border-2 border-current border-t-transparent" />
              )}
              {success && !loading && (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-success h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {rightIcon && !loading && !success && rightIcon}
            </div>
          )}

          {isFocused && (
            <div className="ring-primary/20 pointer-events-none absolute inset-0 rounded-lg ring-2" />
          )}
        </div>

        {error && (
          <p className="text-error flex items-center gap-1 text-sm">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-muted-foreground text-sm">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
