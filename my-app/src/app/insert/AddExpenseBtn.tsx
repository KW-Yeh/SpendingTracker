'use client';

import Link from 'next/link';
import { HTMLAttributes, useEffect, useRef } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  autoClick: boolean;
}

const AddExpenseBtn = (props: Props) => {
  const { autoClick, children } = props;
  const LinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (autoClick) {
      LinkRef.current?.click();
    }
  }, [autoClick]);

  return (
    <div className="bg-background w-full rounded-lg sm:mx-auto sm:w-fit">
      <Link
        ref={LinkRef}
        href="/edit"
        className="gradient-r-from-purple-to-blue flex w-full items-center justify-center rounded-lg px-14 py-4 text-lg sm:w-fit"
        scroll={false}
      >
        {children}
      </Link>
    </div>
  );
};

export default AddExpenseBtn;
