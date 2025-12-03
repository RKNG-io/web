import React from 'react';

export interface ReportSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'highlight' | 'dark';
  children: React.ReactNode;
  className?: string;
}

const ReportSection = React.forwardRef<HTMLElement, ReportSectionProps>(
  ({ id, title, subtitle, variant = 'default', children, className = '' }, ref) => {
    const variantStyles = {
      default: 'bg-white',
      highlight: 'bg-ice',
      dark: 'bg-charcoal text-white',
    };

    return (
      <section
        id={id}
        ref={ref}
        className={`py-12 md:py-16 ${variantStyles[variant]} ${className}`.trim()}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="mb-8 md:mb-12">
              {subtitle && (
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-fuchsia">
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                  {title}
                </h2>
              )}
            </div>
          )}
          <div>{children}</div>
        </div>
      </section>
    );
  }
);

ReportSection.displayName = 'ReportSection';

export default ReportSection;
export { ReportSection };
