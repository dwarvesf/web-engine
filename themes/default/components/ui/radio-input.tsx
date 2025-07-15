import { forwardRef, useState, useEffect } from 'react';
import { cn } from '../../utils';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioInputProps {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  (
    {
      name,
      label,
      error,
      helperText,
      options,
      value,
      defaultValue,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      fullWidth = true,
      className = '',
      size = 'md',
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = useState(
      value || defaultValue || '',
    );
    const radioGroupId = `radio-${name}-${Math.random().toString(36).substring(2, 11)}`;

    // Sync with external value changes (react-hook-form)
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleRadioChange = (optionValue: string) => {
      if (disabled) return;

      setSelectedValue(optionValue);

      // Create a synthetic event for react-hook-form
      if (onChange) {
        const syntheticEvent = {
          target: {
            name,
            value: optionValue,
          },
          type: 'change',
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }
    };

    const baseButtonClasses = cn(
      'border border-alto border-solid transition-all duration-normal focus:outline-none',
      'hover:text-primary focus:text-primary',
      sizes[size],
      disabled && 'opacity-50 cursor-not-allowed',
    );

    const getButtonClasses = (option: RadioOption) => {
      const isSelected = selectedValue === option.value;

      return cn(
        baseButtonClasses,
        'w-full border rounded-sm',
        isSelected &&
          'text-primary border-primary selected-primary ring-1 ring-primary dwarves-shadow outline-none',
        option.disabled && 'opacity-50 cursor-not-allowed',
      );
    };

    return (
      <div
        className={cn(fullWidth ? 'w-full space-y-2' : 'space-y-2', className)}
      >
        {label && (
          <label
            htmlFor={radioGroupId}
            className="text-foreground text-md block font-normal"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        {/* Hidden input for react-hook-form compatibility */}
        <input
          ref={ref}
          type="hidden"
          name={name}
          value={selectedValue}
          onChange={() => {}} // Controlled by buttons
        />

        <div
          role="radiogroup"
          id={radioGroupId}
          className="flex"
          aria-label={label}
        >
          {options.map(option => (
            <button
              key={option.value}
              role="radio"
              type="button"
              aria-checked={selectedValue === option.value}
              disabled={disabled || option.disabled}
              className={getButtonClasses(option)}
              onClick={() => handleRadioChange(option.value)}
              onBlur={() => {
                if (onBlur) {
                  const syntheticEvent = {
                    target: {
                      name,
                      value: selectedValue,
                    },
                    type: 'blur',
                  } as React.FocusEvent<HTMLInputElement>;
                  onBlur(syntheticEvent);
                }
              }}
            >
              {option.label}
            </button>
          ))}
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

RadioInput.displayName = 'RadioInput';

export default RadioInput;
