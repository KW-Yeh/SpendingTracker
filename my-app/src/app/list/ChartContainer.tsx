import { ReactNode } from 'react';

export const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="relative flex w-full flex-col items-center rounded-2xl p-6 shadow-[0px_0px_4px_1px_rgba(0,_0,_0,_0.1)]">
      <h2 className="mb-4 w-full select-none text-start text-lg font-bold sm:text-xl sm:hover:cursor-pointer">
        {title}
      </h2>
      {children}
    </div>
  );
};
