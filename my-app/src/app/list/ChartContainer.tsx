import { ReactNode } from 'react';

export const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="bg-background relative flex w-full flex-col items-center rounded-3xl border border-solid border-gray-300 p-6 shadow">
      <h2 className="mb-4 w-full text-start text-lg font-bold select-none sm:text-xl sm:hover:cursor-pointer">
        {title}
      </h2>
      {children}
    </div>
  );
};
