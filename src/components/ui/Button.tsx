'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      disabled,
      href,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variantStyles = {
      primary: 'bg-fuchsia text-white hover:bg-fuchsia-dark',
      secondary: 'bg-charcoal text-white hover:bg-ink',
      outline: 'border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white',
      tertiary: 'bg-blue text-charcoal hover:bg-blue-light',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        disabled={disabled}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { Button };
