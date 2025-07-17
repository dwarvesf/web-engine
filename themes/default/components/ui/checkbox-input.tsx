import { forwardRef } from 'react';
import { cn } from '../../utils';

interface CheckboxInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  (
    { label, error, helperText, size = 'lg', className = '', id, ...props },
    ref,
  ) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;

    const checkboxClasses = cn(
      'accent-primary border border-border rounded transition-colors duration-200 outline-none focus:ring-1 focus:ring-primary-light focus:ring-offset-1',
      'checked:bg-primary checked:border-primary checked:text-primary-foreground',
      'hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed',
      sizes[size],
      error && 'border-error focus:ring-error',
      className,
    );

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={checkboxClasses}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-foreground cursor-pointer select-none',
                props.disabled && 'cursor-not-allowed opacity-50',
                error && 'text-error',
              )}
            >
              {label}
            </label>
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

CheckboxInput.displayName = 'CheckboxInput';

export default CheckboxInput;
