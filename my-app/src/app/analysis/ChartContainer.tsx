import { ReactNode } from 'react';

export const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="card relative z-10 flex w-full flex-col items-center transition-all duration-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
      <div className="mb-4 w-full">
        <h2
          className="relative inline-block text-xl font-bold text-gray-100 select-none"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
          <span className="from-primary-500 to-accent-500 absolute -bottom-1 left-0 h-1 w-1/2 rounded-full bg-linear-to-r shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span>
        </h2>
      </div>
      {children}
    </div>
  );
};
