import { HTMLAttributes } from 'react';

export const BookIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
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
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v16H5.5A1.5 1.5 0 0 1 4 18.5Z" />
      <path d="M7 4v16" />
    </svg>
  );
};
