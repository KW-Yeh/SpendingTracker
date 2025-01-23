import { ReactNode } from 'react';

export const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex w-96 flex-col items-center rounded-2xl p-4 text-xs">
      <h2 className="w-full select-none text-start text-base font-bold sm:text-lg sm:hover:cursor-pointer">
        {title}
      </h2>
      {children}
    </div>
  );
};
