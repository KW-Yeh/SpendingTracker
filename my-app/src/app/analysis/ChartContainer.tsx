import { ReactNode } from 'react';

export const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="card card-interactive relative flex w-full flex-col items-center z-10">
      <div className="mb-4 w-full">
        <h2
          className="relative inline-block text-xl font-bold text-gray-800 select-none"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
          <span className="absolute -bottom-1 left-0 h-1 w-1/2 rounded-full bg-linear-to-r from-primary-500 to-accent-500"></span>
        </h2>
      </div>
      {children}
    </div>
  );
};
