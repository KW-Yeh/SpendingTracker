'use client';

import Link from 'next/link';
import { HTMLAttributes, useEffect, useRef } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  autoClick: boolean;
}

const AddExpenseBtn = (props: Props) => {
  const { className = '', autoClick, children } = props;
  const LinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (autoClick) {
      LinkRef.current?.click();
    }
  }, [autoClick]);

  return (
    <Link
      ref={LinkRef}
      href="/edit"
      className={`shadow-primary text-primary-700 bg-background active:shadow-primary-hover sm:hover:shadow-primary-hover mx-auto flex rounded-full px-14 py-4 text-center transition-all active:text-blue-700 sm:hover:text-blue-700 ${className}`}
      scroll={false}
    >
      {children}
    </Link>
  );
};

export default AddExpenseBtn;
