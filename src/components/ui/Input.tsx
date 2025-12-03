import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = '',
      type = 'text',
      required,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const baseStyles = 'w-full rounded-md border bg-ice px-4 py-2.5 text-charcoal transition-colors placeholder:text-charcoal/50 focus:outline-none focus:ring-2 focus:ring-fuchsia focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';

    const errorStyles = error ? 'border-error focus:ring-error' : 'border-stone';

    const inputClasses = `${baseStyles} ${errorStyles} ${className}`.trim();

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-charcoal"
          >
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
export { Input };
