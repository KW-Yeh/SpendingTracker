'use client';

import { ActionMenuIcon } from '@/components/icons/ActionMenuIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { ReactNode, useRef, useState } from 'react';

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
  const [openAbove, setOpenAbove] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpen(false);
  });

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const menuHeight = menuRef.current?.offsetHeight ?? 200;
      setOpenAbove(spaceBelow < menuHeight + 16);
    }
    setOpen((prev) => !prev);
  };

  return (
    <div ref={ref} className={`relative ${open ? 'z-40' : ''}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 transition-all duration-200 ${open ? 'bg-primary-500/20 text-primary-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'text-gray-400 hover:bg-gray-700/70 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] active:bg-gray-600/70'}`}
        aria-label="Open action menu"
        aria-expanded={open}
      >
        <ActionMenuIcon className="size-5" />
      </button>
      <div
        ref={menuRef}
        className={`absolute right-0 z-30 flex w-fit flex-col rounded-xl border border-gray-600 bg-gray-800 p-2 shadow-xl backdrop-blur-sm transition-all duration-200 ${openAbove ? 'bottom-full mb-2' : 'top-full mt-2'} ${open ? 'scale-100 opacity-100' : 'hidden scale-95 opacity-0'}`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (onClick) onClick(option.value);
            }}
            className={`group hover:text-primary-400 flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-4 py-3 whitespace-nowrap transition-all duration-200 hover:bg-gray-700/70 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] active:bg-gray-600/70 ${option.className ?? ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
