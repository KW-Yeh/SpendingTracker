'use client';

import { BackspaceIcon } from '@/components/icons/BackspaceIcon';
import { HTMLAttributes, useEffect, useState } from 'react';

interface Props {
  default?: number;
  onChange?: (val: number) => void;
}

export interface NumberKeyboardRef {
  getAmount: () => number;
}

const KEYS = [
  '7',
  '8',
  '9',
  '4',
  '5',
  '6',
  '1',
  '2',
  '3',
  'clear',
  '0',
  'delete',
];

export const NumberKeyboard = (props: Props) => {
  const { default: defaultValue = 0, onChange = console.log } = props;
  const [amount, setAmount] = useState(defaultValue.toString());

  const handleOnClick = (val: string) => {
    if (val === 'clear') {
      setAmount('0');
    } else if (val === 'delete') {
      setAmount((prevState) => {
        if (prevState.length === 1) return '0';
        return prevState.slice(0, prevState.length - 1);
      });
    } else {
      setAmount((prevState) => {
        if (prevState === '0') return val;
        return prevState + val;
      });
    }
  };

  useEffect(() => {
    onChange(Number(amount));
  }, [amount, onChange]);

  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-2 text-base sm:text-lg">
      {KEYS.map((key, index) => (
        <Key
          key={key}
          value={key}
          className="col-span-1"
          style={{ gridRow: Math.floor(index / 4) + 1 }}
          onClick={handleOnClick}
        >
          {key === 'delete' && <BackspaceIcon className="size-5" />}
          {key === 'clear' && 'C'}
          {key === '.' && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-dot"
              viewBox="0 0 16 16"
            >
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
            </svg>
          )}
          {key !== 'delete' && key !== 'clear' && key !== '.' && key}
        </Key>
      ))}
    </div>
  );
};
NumberKeyboard.displayName = 'NumberKeyboard';

const Key = (
  props: Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> & {
    value: string;
    onClick: (val: string) => void;
  },
) => {
  return (
    <button
      type="button"
      className={`${props.className} hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 active:bg-primary-100 flex min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-xl border-2 border-solid border-gray-200 bg-white px-6 py-4 font-semibold text-gray-800 shadow-sm transition-all duration-200 select-none hover:brightness-110 active:brightness-100 sm:min-h-[64px] sm:min-w-[64px]`}
      onClick={() => props.onClick(props.value)}
    >
      <span>{props.children}</span>
    </button>
  );
};
