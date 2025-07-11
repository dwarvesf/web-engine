import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../utils';

interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  label?: string;
  description?: string;
  error?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizes = {
  sm: {
    switch: 'h-4 w-7',
    thumb: 'h-3 w-3',
    translate: 'translate-x-3',
    padding: 'p-0.5',
  },
  md: {
    switch: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
    padding: 'p-0.5',
  },
  lg: {
    switch: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
    padding: 'p-0.5',
  },
};

const variants = {
  default: {
    on: 'bg-primary',
    off: 'bg-gray-200',
  },
  success: {
    on: 'bg-success',
    off: 'bg-gray-200',
  },
  warning: {
    on: 'bg-warning',
    off: 'bg-gray-200',
  },
  danger: {
    on: 'bg-error',
    off: 'bg-gray-200',
  },
};

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      size = 'md',
      variant = 'default',
      label,
      description,
      error,
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      checked,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = sizes[size];
    const variantClasses = variants[variant];
    const isDisabled = disabled || loading;
    const isChecked = checked;

    return (
      <div className={cn('flex items-start space-x-3', className)}>
        {leftIcon && <div className="mt-1 flex-shrink-0">{leftIcon}</div>}

        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              role="switch"
              aria-checked={isChecked}
              disabled={isDisabled}
              className={cn(
                'dwarves-focus-ring relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none',
                sizeClasses.switch,
                sizeClasses.padding,
                isChecked ? variantClasses.on : variantClasses.off,
                isDisabled && 'cursor-not-allowed opacity-50',
                !isDisabled && 'cursor-pointer',
              )}
              onClick={() => {
                if (!isDisabled && props.onChange) {
                  const syntheticEvent = {
                    target: { checked: !isChecked },
                  } as React.ChangeEvent<HTMLInputElement>;
                  props.onChange(syntheticEvent);
                }
              }}
            >
              <span
                className={cn(
                  'inline-block transform rounded-full bg-white shadow-sm transition-transform duration-200',
                  sizeClasses.thumb,
                  isChecked ? sizeClasses.translate : 'translate-x-0',
                )}
              >
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="dwarves-loading-spin h-2 w-2 rounded-full border border-gray-400 border-t-transparent" />
                  </div>
                )}
              </span>
            </button>

            <input
              ref={ref}
              type="checkbox"
              className="sr-only"
              checked={checked}
              disabled={isDisabled}
              {...props}
            />

            {label && (
              <label
                className={cn(
                  'text-foreground cursor-pointer text-sm font-medium',
                  isDisabled && 'cursor-not-allowed opacity-50',
                )}
                onClick={() => {
                  if (!isDisabled && props.onChange) {
                    const syntheticEvent = {
                      target: { checked: !isChecked },
                    } as React.ChangeEvent<HTMLInputElement>;
                    props.onChange(syntheticEvent);
                  }
                }}
              >
                {label}
              </label>
            )}
          </div>

          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}

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
        </div>

        {rightIcon && <div className="mt-1 flex-shrink-0">{rightIcon}</div>}
      </div>
    );
  },
);

Toggle.displayName = 'Toggle';

export default Toggle;
