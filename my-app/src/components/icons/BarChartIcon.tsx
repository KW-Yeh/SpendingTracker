import { HTMLAttributes } from 'react';

export const BarChartIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
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
      <path d="M4 20h16M7 20v-6M12 20V6M17 20v-9" />
    </svg>
  );
};
