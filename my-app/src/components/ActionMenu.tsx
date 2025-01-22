'use client';

import { ActionMenuIcon } from '@/components/icons/ActionMenuIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { ReactNode, useState } from 'react';

interface Props {
  options: {
    value: string;
    label: ReactNode;
  }[];
  onClick: (value: string) => void;
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
        className={`rounded-full p-2 transition-colors ${open ? 'bg-gray-300' : 'active:bg-gray-300 sm:hover:bg-gray-300'}`}
      >
        <ActionMenuIcon className="size-4" />
      </button>
      <div
        className={`absolute right-3 top-full z-30 flex w-fit flex-col rounded-lg bg-background p-2 shadow transition-all ${open ? 'opacity-100' : 'hidden opacity-0'}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onClick(option.value);
            }}
            className="flex items-center gap-2 whitespace-nowrap rounded px-4 py-2 transition-colors active:bg-primary-100 sm:hover:bg-primary-100"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
