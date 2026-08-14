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
        prefetch={true}
        className="gradient-intense flex items-center justify-center gap-2 rounded-lg px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md sm:px-6 sm:py-3"
        scroll={false}
      >
        <IoMdAdd className="size-5" />
        <span>{children}</span>
      </Link>
    </div>
  );
};

export default AddExpenseBtn;
