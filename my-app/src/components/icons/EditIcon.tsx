import { HTMLAttributes } from 'react';

export const EditIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
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
      <path d="M4 20h4l10-10-4-4L4 16Z" />
      <path d="m14 6 4 4" />
    </svg>
  );
};
