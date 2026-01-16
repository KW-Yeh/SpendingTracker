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
        className={`min-h-[44px] min-w-[44px] rounded-full p-2 transition-all duration-200 ${open ? 'bg-primary-500/20 text-primary-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-gray-400 hover:bg-gray-700/70 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] active:bg-gray-600/70'}`}
        aria-label="Open action menu"
        aria-expanded={open}
      >
        <ActionMenuIcon className="size-5" />
      </button>
      <div
        className={`absolute top-full right-0 z-30 mt-2 flex w-fit flex-col rounded-xl border border-gray-600 bg-gray-800 p-2 shadow-xl backdrop-blur-sm transition-all duration-200 ${open ? 'scale-100 opacity-100' : 'hidden scale-95 opacity-0'}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (onClick) onClick(option.value);
            }}
            className={`group hover:text-primary-400 flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg px-4 py-3 whitespace-nowrap transition-all duration-200 hover:bg-gray-700/70 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] active:bg-gray-600/70 ${option.className ?? ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
