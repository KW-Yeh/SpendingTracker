'use client';

import { BackspaceIcon } from '@/components/icons/BackspaceIcon';
import { HTMLAttributes, useCallback, useState } from 'react';

interface Props {
  default?: number;
  onConfirm: (num: number) => void;
}

const KEYS = [
  '7',
  '8',
  '9',
  'delete',
  '4',
  '5',
  '6',
  'clear',
  '1',
  '2',
  '3',
  '00',
  '0',
  '.',
];

export const NumberKeyboard = (props: Props) => {
  const { default: defaultValue, onConfirm } = props;
  const [amount, setAmount] = useState((defaultValue ?? 0) + '');
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

  const handleSubmit = useCallback(() => {
    try {
      onConfirm(Number(amount));
    } catch {
      alert('Invalid amount');
    }
  }, [onConfirm, amount]);

  return (
    <div className="flex flex-col items-center text-sm sm:text-base">
      <p className="mb-2 mt-1 w-full rounded-md border-2 border-solid border-text p-4 text-end text-lg font-bold">
        {amount}
      </p>
      <div className="grid w-fit grid-cols-4 grid-rows-4 gap-2">
        {KEYS.map((key, index) => (
          <Key
            key={key}
            value={key}
            className="col-span-1"
            style={{ gridRow: Math.floor(index / 4) + 1 }}
            onClick={handleOnClick}
          >
            {key === 'delete' && <BackspaceIcon className="size-4" />}
            {key === 'clear' && 'C'}
            {key === '.' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
        <button
          type="button"
          className="col-span-1 col-start-4 row-span-2 row-start-3 rounded-full border border-solid border-text bg-green-300 font-bold shadow-[2px_2px_4px_0px_#6b7280] active:bg-green-500 sm:hover:bg-green-500"
          onClick={handleSubmit}
        >
          確定
        </button>
      </div>
    </div>
  );
};

const Key = (
  props: Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> & {
    value: string;
    onClick: (val: string) => void;
  },
) => {
  return (
    <button
      className={`${props.className} flex aspect-square size-16 select-none items-center justify-center rounded-full border border-solid border-text shadow-[2px_2px_4px_0px_#6b7280] transition-colors active:bg-primary-300 sm:hover:bg-primary-100`}
      onClick={() => props.onClick(props.value)}
    >
      <span>{props.children}</span>
    </button>
  );
};
