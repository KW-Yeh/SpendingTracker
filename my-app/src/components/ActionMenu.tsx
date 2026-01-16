'use client';

import { ActionMenuIcon } from '@/components/icons/ActionMenuIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { ReactNode, useState } from 'react';

interface Props {
  options: {
    value: string;
    label: ReactNode;
    className?: string;
  }[];
  onClick?: (value: string) => void;
}

export const ActionMenu = (props: Props) => {
  const { options, onClick } = props;

  const [open, setOpen] = useState(false);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpen(false);
  });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((prevState) => !prevState);
        }}
        className={`min-w-[44px] min-h-[44px] rounded-full p-2 transition-all duration-200 ${open ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 active:bg-gray-200'}`}
        aria-label="Open action menu"
        aria-expanded={open}
      >
        <ActionMenuIcon className="size-5" />
      </button>
      <div
        className={`bg-white absolute top-full right-0 mt-2 z-30 flex w-fit flex-col rounded-xl p-2 shadow-lg border border-gray-200 transition-all duration-200 ${open ? 'opacity-100 scale-100' : 'hidden opacity-0 scale-95'}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (onClick) onClick(option.value);
            }}
            className={`group flex items-center gap-2 rounded-lg px-4 py-3 min-h-[44px] whitespace-nowrap transition-all duration-200 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 cursor-pointer ${option.className ?? ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
