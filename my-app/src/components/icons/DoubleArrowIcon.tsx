import { HTMLAttributes } from 'react';

export const DoubleArrowIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
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
      <path d="m7 6 6 6-6 6M14 6l6 6-6 6" />
    </svg>
  );
};
