'use client';

import { BackspaceIcon } from '@/components/icons/BackspaceIcon';
import { CSSProperties, ReactNode } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
}

export const NumberKeyboard = ({ value, onChange, onSubmit }: Props) => {
  const press = (k: string) => {
    if (k === 'clear') {
      onChange('0');
      return;
    }
    if (k === 'delete') {
      onChange(value.length <= 1 ? '0' : value.slice(0, -1));
      return;
    }
    if (k === 'submit') {
      onSubmit?.();
      return;
    }
    if (k === '.') {
      if (value.includes('.')) return;
      onChange(value + '.');
      return;
    }
    // digit ('0','1'..'9') or multi-digit ('00','000')
    if (value === '0') {
      // overwrite the leading zero unless inserting '00'/'000' which would still mean 0
      if (k === '00' || k === '000') return;
      onChange(k);
      return;
    }
    onChange(value + k);
  };

  return (
    <div
      className="grid gap-1.5 sm:gap-2"
      style={{
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, minmax(48px, 1fr))',
      }}
    >
      {/* row 1: 7 8 9 ⌫ */}
      <Key value="7" onPress={press} style={{ gridRow: 1, gridColumn: 1 }}>7</Key>
      <Key value="8" onPress={press} style={{ gridRow: 1, gridColumn: 2 }}>8</Key>
      <Key value="9" onPress={press} style={{ gridRow: 1, gridColumn: 3 }}>9</Key>
      <Key value="delete" variant="delete" onPress={press} style={{ gridRow: 1, gridColumn: 4 }}>
        <BackspaceIcon className="size-5" />
      </Key>

      {/* row 2: 4 5 6 . */}
      <Key value="4" onPress={press} style={{ gridRow: 2, gridColumn: 1 }}>4</Key>
      <Key value="5" onPress={press} style={{ gridRow: 2, gridColumn: 2 }}>5</Key>
      <Key value="6" onPress={press} style={{ gridRow: 2, gridColumn: 3 }}>6</Key>
      <Key value="." onPress={press} style={{ gridRow: 2, gridColumn: 4 }}>
        <span className="text-2xl leading-none">·</span>
      </Key>

      {/* row 3: 1 2 3 ✓ (start of submit, spans rows 3-4) */}
      <Key value="1" onPress={press} style={{ gridRow: 3, gridColumn: 1 }}>1</Key>
      <Key value="2" onPress={press} style={{ gridRow: 3, gridColumn: 2 }}>2</Key>
      <Key value="3" onPress={press} style={{ gridRow: 3, gridColumn: 3 }}>3</Key>
      <Key
        value="submit"
        variant="submit"
        onPress={press}
        style={{ gridRow: '3 / span 2', gridColumn: 4 }}
      >
        <IoCheckmarkSharp className="size-7" />
      </Key>

      {/* row 4: 0 00 C */}
      <Key value="0" onPress={press} style={{ gridRow: 4, gridColumn: 1 }}>0</Key>
      <Key value="00" onPress={press} style={{ gridRow: 4, gridColumn: 2 }}>00</Key>
      <Key value="clear" variant="clear" onPress={press} style={{ gridRow: 4, gridColumn: 3 }}>
        C
      </Key>
    </div>
  );
};
NumberKeyboard.displayName = 'NumberKeyboard';

type KeyVariant = 'digit' | 'delete' | 'clear' | 'submit';

const Key = ({
  value,
  variant = 'digit',
  onPress,
  style,
  children,
}: {
  value: string;
  variant?: KeyVariant;
  onPress: (val: string) => void;
  style?: CSSProperties;
  children: ReactNode;
}) => {
  const variantClass =
    variant === 'submit'
      ? 'text-white font-extrabold'
      : variant === 'delete'
        ? 'bg-white/[0.04] text-[var(--color-expense)] border border-white/[0.06]'
        : 'bg-white/[0.04] text-gray-100 border border-white/[0.06]';

  const submitBg =
    variant === 'submit'
      ? {
          background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
          boxShadow: '0 8px 20px rgba(6, 182, 212, 0.35)',
        }
      : undefined;

  return (
    <button
      type="button"
      style={{ ...style, ...submitBg }}
      className={`flex cursor-pointer items-center justify-center rounded-[14px] text-lg font-semibold transition-colors select-none active:scale-[0.97] sm:text-xl ${variantClass}`}
      onClick={() => onPress(value)}
    >
      {children}
    </button>
  );
};
