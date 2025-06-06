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
    <div className="bg-background rounded-lg">
      <Link
        ref={LinkRef}
        href="/edit"
        className="gradient-r-from-purple-to-blue mx-auto flex rounded-lg px-14 py-4 text-center text-lg"
        scroll={false}
      >
        {children}
      </Link>
    </div>
  );
};

export default AddExpenseBtn;
