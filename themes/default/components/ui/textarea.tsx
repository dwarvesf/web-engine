import { TextareaHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../utils';

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined' | 'ghost';
  fullWidth?: boolean;
  maxHeight?: number;
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
    'bg-transparent border-1 border-border focus:border-primary hover:border-border-hover',
  ghost: 'bg-transparent border-0 focus:bg-input/50 hover:bg-input/30',
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      variant = 'default',
      className = '',
      id,
      fullWidth = true,
      maxHeight = 200,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = cn(
      'rounded-sm transition-all duration-normal focus:outline-none',
      'placeholder:text-muted-foreground resize-y',
      fullWidth ? 'w-full' : '',
    );

    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      error && 'border-error focus:border-error',
      props.disabled && 'opacity-50 cursor-not-allowed',
      className,
    );

    return (
      <div className={fullWidth ? 'w-full space-y-2' : 'space-y-2'}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-foreground text-md block font-normal"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div
          className={cn('relative flex', fullWidth ? 'w-full' : 'inline-block')}
        >
          <textarea
            ref={ref}
            id={textareaId}
            className={classes}
            style={{ maxHeight: `${maxHeight}px` }}
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

          {isFocused && (
            <div className="ring-primary/20 pointer-events-none absolute inset-0 rounded-sm" />
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

Textarea.displayName = 'Textarea';

export default Textarea;
