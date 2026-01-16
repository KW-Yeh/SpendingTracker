import { HTMLAttributes } from 'react';

export const PageTitle = (props: HTMLAttributes<HTMLDivElement>) => {
  const { children, className = '', ...legacy } = props;
  return (
    <h1
      className={`clipped-text gradient-r-from-orange-to-red w-fit self-center p-6 text-2xl font-extrabold sm:text-3xl ${className}`}
      style={{ fontFamily: 'var(--font-heading)' }}
      {...legacy}
    >
      {children}
    </h1>
  );
};
