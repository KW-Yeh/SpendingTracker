import { ReactNode } from 'react';

export const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="relative flex w-full flex-col items-center rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg z-10">
      <div className="mb-4 w-full">
        <h2 className="relative inline-block text-xl font-bold text-gray-800 select-none">
          {title}
          <span className="absolute -bottom-1 left-0 h-1 w-1/2 rounded-full bg-primary-300"></span>
        </h2>
      </div>
      {children}
    </div>
  );
};
