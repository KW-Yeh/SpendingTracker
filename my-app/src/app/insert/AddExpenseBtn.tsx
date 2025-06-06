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
        className="gradient-r-from-purple-to-blue flex items-center justify-center rounded-lg px-6 py-2"
        scroll={false}
      >
        {children}
      </Link>
    </div>
  );
};

export default AddExpenseBtn;
