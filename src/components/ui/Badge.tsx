import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'fuchsia' | 'mint' | 'blue';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-full';

    const variantStyles = {
      default: 'bg-stone text-charcoal',
      fuchsia: 'bg-fuchsia text-white',
      mint: 'bg-mint text-charcoal',
      blue: 'bg-blue text-charcoal',
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
export { Badge };
