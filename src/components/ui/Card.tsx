import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'white' | 'dark' | 'mint' | 'blue' | 'fuchsia';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-lg p-7';

    const variantStyles = {
      default: 'bg-ice',
      white: 'bg-white border border-stone',
      dark: 'bg-charcoal text-white',
      mint: 'bg-mint',
      blue: 'bg-blue',
      fuchsia: 'bg-fuchsia text-white',
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
export { Card };
