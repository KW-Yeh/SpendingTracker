import Link from 'next/link';
import { ReactNode } from 'react';
import { IoMdAdd } from 'react-icons/io';

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
        className="gradient-r-from-purple-to-blue flex items-center justify-center gap-2 rounded-lg px-4 py-2 sm:px-6 sm:py-3 shadow-sm hover:shadow-md transition-all duration-200"
        scroll={false}
      >
        <IoMdAdd className="size-5" />
        <span>{children}</span>
      </Link>
    </div>
  );
};

export default AddExpenseBtn;
