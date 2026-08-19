import { HTMLAttributes } from 'react';

export const CoinIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
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
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.2 9.2A2.4 2.4 0 0 0 12 8h-.6a2 2 0 0 0 0 4h1.2a2 2 0 0 1 0 4H12a2.4 2.4 0 0 1-2.2-1.2M12 6.4v1.6M12 16v1.6" />
    </svg>
  );
};
