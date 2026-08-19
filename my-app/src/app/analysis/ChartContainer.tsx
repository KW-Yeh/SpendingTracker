import { ReactNode } from 'react';

export const ChartContainer = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => {
  return (
    <section className="card flex w-full min-w-0 flex-col items-center">
      <div className="mb-4 w-full">
        <h2
          className="font-semibold text-gray-100"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '17px',
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
};
