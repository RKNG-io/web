import React from 'react';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {
  number?: string;
  subtitle?: string;
  title: string;
}

const SectionHeader = React.forwardRef<HTMLElement, SectionHeaderProps>(
  ({ number, subtitle, title, className = '', ...props }, ref) => {
    return (
      <header ref={ref} className={`space-y-2 ${className}`.trim()} {...props}>
        {number && (
          <div className="text-xs font-semibold uppercase tracking-wider text-fuchsia">
            {number}
          </div>
        )}
        {subtitle && (
          <p className="text-sm font-medium uppercase tracking-wide text-charcoal/70">
            {subtitle}
          </p>
        )}
        <h2 className="text-4xl font-semibold text-charcoal md:text-5xl lg:text-6xl">
          {title}
        </h2>
      </header>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
export { SectionHeader };
