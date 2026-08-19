import { HTMLAttributes } from 'react';

export const SearchIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.2 16.2 4 4" />
    </svg>
  );
};
