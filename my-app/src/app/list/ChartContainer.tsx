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
      <h2 className="pb-18 w-full text-center text-lg font-bold select-none hover:cursor-pointer sm:text-xl">
        {title}
      </h2>
      {children}
    </div>
  );
};
