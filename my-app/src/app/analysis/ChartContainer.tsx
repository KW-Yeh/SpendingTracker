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
      <div className="mb-5 w-full">
        <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
};
