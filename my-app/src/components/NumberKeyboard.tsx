'use client';

import { BackspaceIcon } from '@/components/icons/BackspaceIcon';
import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';

interface Props {
  default?: number;
  onChange?: (val: number) => void;
  onSubmit?: () => void;
}

type KeyDef = {
  value: string;
  label: ReactNode;
  variant?: 'digit' | 'delete' | 'clear' | 'submit';
};

const DIGIT_KEYS: KeyDef[] = [
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '00', label: '00' },
  { value: '0', label: '0' },
  { value: '000', label: '000' },
];

export const NumberKeyboard = (props: Props) => {
  const { default: defaultValue = 0, onChange, onSubmit } = props;
  const [amount, setAmount] = useState(defaultValue.toString());

  const handleOnClick = (val: string) => {
    if (val === 'clear') {
      setAmount('0');
    } else if (val === 'delete') {
      setAmount((prev) => (prev.length === 1 ? '0' : prev.slice(0, -1)));
    } else if (val === 'submit') {
      onSubmit?.();
    } else {
      setAmount((prev) => (prev === '0' ? val : prev + val));
    }
  };

  useEffect(() => {
    onChange?.(Number(amount));
  }, [amount, onChange]);

  return (
    <div
      className="grid gap-1.5 sm:gap-2"
      style={{
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, minmax(50px, 1fr))',
      }}
    >
      {/* digit grid: cols 1-3, rows 1-4 */}
      {DIGIT_KEYS.map((k, idx) => {
        const row = Math.floor(idx / 3) + 1;
        const col = (idx % 3) + 1;
        return (
          <Key
            key={k.value + idx}
            value={k.value}
            onClick={handleOnClick}
            style={{ gridRow: row, gridColumn: col }}
          >
            {k.label}
          </Key>
        );
      })}
      {/* col 4: delete (row1), clear (row2), submit (rows 3-4) */}
      <Key
        value="delete"
        variant="delete"
        onClick={handleOnClick}
        style={{ gridRow: 1, gridColumn: 4 }}
      >
        <BackspaceIcon className="size-5" />
      </Key>
      <Key
        value="clear"
        variant="clear"
        onClick={handleOnClick}
        style={{ gridRow: 2, gridColumn: 4 }}
      >
        C
      </Key>
      <Key
        value="submit"
        variant="submit"
        onClick={handleOnClick}
        style={{ gridRow: '3 / span 2', gridColumn: 4 }}
      >
        <IoCheckmarkSharp className="size-7" />
      </Key>
    </div>
  );
};
NumberKeyboard.displayName = 'NumberKeyboard';

type KeyProps = Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  value: string;
  variant?: 'digit' | 'delete' | 'clear' | 'submit';
  onClick: (val: string) => void;
};

const Key = (props: KeyProps) => {
  const { variant = 'digit', children, style, value, onClick, ...rest } = props;

  const variantClass =
    variant === 'submit'
      ? 'text-white font-extrabold shadow-[0_8px_20px_rgba(6,182,212,0.35)]'
      : variant === 'delete'
        ? 'bg-white/[0.04] text-[var(--color-expense)] border border-white/[0.06]'
        : 'bg-white/[0.04] text-gray-100 border border-white/[0.06]';

  const submitBg =
    variant === 'submit'
      ? { background: 'linear-gradient(135deg, #06B6D4, #0891B2)' }
      : undefined;

  return (
    <button
      {...rest}
      type="button"
      style={{ ...style, ...submitBg }}
      className={`flex cursor-pointer items-center justify-center rounded-[14px] text-lg font-semibold transition-colors select-none active:scale-[0.97] sm:text-xl ${variantClass}`}
      onClick={() => onClick(value)}
    >
      {children}
    </button>
  );
};
