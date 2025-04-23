'use client';

import { BackspaceIcon } from '@/components/icons/BackspaceIcon';
import {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

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

export const NumberKeyboard = forwardRef<NumberKeyboardRef, Props>(
  (props, ref) => {
    const { default: defaultValue = 0, onChange = console.log } = props;
    const [amount, setAmount] = useState(defaultValue.toString());

    useImperativeHandle(ref, () => ({
      getAmount: () => {
        return Number(amount);
      },
    }));

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
      <div className="grid grid-cols-3 grid-rows-4 gap-1 text-sm sm:text-base">
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
      </div>
    );
  },
);
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
      className={`${props.className} active:bg-background-gray hover:bg-background-gray flex select-none items-center justify-center rounded border border-solid border-gray-300 bg-background px-6 py-3 transition-colors`}
      onClick={() => props.onClick(props.value)}
    >
      <span>{props.children}</span>
    </button>
  );
};
