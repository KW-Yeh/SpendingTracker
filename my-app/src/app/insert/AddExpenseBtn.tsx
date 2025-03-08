'use client';

import Link from 'next/link';
import { HTMLAttributes, useEffect, useRef } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  borderStyle?: string;
  autoClick: boolean;
}

const AddExpenseBtn = (props: Props) => {
  const {
    className = '',
    autoClick,
    children,
  } = props;
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
      onClick={() => console.log('Route to edit page')}
      className={`fixed bottom-8 z-30 mx-auto flex w-40 overflow-hidden rounded-full bg-primary-700 p-px shadow-[0px_0px_6px_0px_#7b56e1] transition-all active:scale-105 active:bg-primary-500 active:shadow-[0px_0px_8px_0px_#7b56e1] sm:hover:scale-105 sm:hover:bg-primary-500 sm:hover:shadow-[0px_0px_8px_0px_#7b56e1] ${className}`}
      scroll={false}
    >
      <div className="z-40 flex w-full items-center justify-center rounded-full border border-solid border-white bg-background p-4 font-bold">
        {children}
      </div>
    </Link>
  );
};

export default AddExpenseBtn;
