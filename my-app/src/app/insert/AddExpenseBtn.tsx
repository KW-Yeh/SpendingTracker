import Link from 'next/link';
import { ReactNode } from 'react';

const AddExpenseBtn = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-background w-fit rounded-lg ${className}`}>
      <Link
        href="/edit"
        className="gradient-r-from-purple-to-blue flex items-center justify-center rounded-lg px-4 py-2 sm:px-6 sm:py-3"
        scroll={false}
      >
        {children}
      </Link>
    </div>
  );
};

export default AddExpenseBtn;
