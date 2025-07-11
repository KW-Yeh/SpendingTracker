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
        className={`rounded-full p-2 transition-colors ${open ? 'bg-gray-300' : 'hover:bg-gray-300 active:bg-gray-300'}`}
      >
        <ActionMenuIcon className="size-4" />
      </button>
      <div
        className={`bg-background absolute top-full right-3 z-30 flex w-fit flex-col rounded-lg p-2 shadow transition-all ${open ? 'opacity-100' : 'hidden opacity-0'}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (onClick) onClick(option.value);
            }}
            className={`group flex items-center gap-2 rounded px-4 py-2 whitespace-nowrap transition-colors hover:bg-gray-100 active:bg-gray-100 ${option.className ?? ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
