import { ReactNode } from 'react';

export const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="card relative z-10 flex w-full flex-col items-center transition-all duration-200">
      <div className="mb-4 w-full">
        <h2
          className="relative inline-block text-xl font-semibold text-gray-100 select-none"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
};
