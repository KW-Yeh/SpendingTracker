import { HTMLAttributes } from 'react';

export const PageTitle = (props: HTMLAttributes<HTMLDivElement>) => {
  const { children, className = '', ...legacy } = props;
  return (
    <h1
      className={`clipped-text gradient-r-from-purple-to-blue p-6 text-xl font-bold sm:text-2xl ${className}`}
      {...legacy}
    >
      {children}
    </h1>
  );
};
