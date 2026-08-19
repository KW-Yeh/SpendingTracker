import { HTMLAttributes } from 'react';

export const HomeIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
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
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.8 10v9a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
};
