import { HTMLAttributes } from 'react';

export const DeleteIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
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
      <path d="M4.5 6.5h15M9 6.5V4.8h6v1.7" />
      <path d="M6.5 6.5 7.4 20h9.2l.9-13.5" />
    </svg>
  );
};
