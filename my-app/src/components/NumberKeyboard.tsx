'use client';

import { BackspaceIcon } from '@/components/icons/BackspaceIcon';
import { CSSProperties, ReactNode } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const NumberKeyboard = ({ value, onChange }: Props) => {
  const press = (k: string) => {
    if (k === 'clear') {
      onChange('0');
      return;
    }
    if (k === 'delete') {
      onChange(value.length <= 1 ? '0' : value.slice(0, -1));
      return;
    }
    if (k === '.') {
      if (value.includes('.')) return;
      onChange(value + '.');
      return;
    }
    // digit ('0','1'..'9') or multi-digit ('00','000')
    if (value === '0') {
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
      <Key value="7" onPress={press} style={{ gridRow: 1, gridColumn: 1 }}>
        7
      </Key>
      <Key value="8" onPress={press} style={{ gridRow: 1, gridColumn: 2 }}>
        8
      </Key>
      <Key value="9" onPress={press} style={{ gridRow: 1, gridColumn: 3 }}>
        9
      </Key>
      <Key
        value="delete"
        variant="delete"
        onPress={press}
        style={{ gridRow: 1, gridColumn: 4 }}
      >
        <BackspaceIcon className="size-5" />
      </Key>

      {/* row 2: 4 5 6 . */}
      <Key value="4" onPress={press} style={{ gridRow: 2, gridColumn: 1 }}>
        4
      </Key>
      <Key value="5" onPress={press} style={{ gridRow: 2, gridColumn: 2 }}>
        5
      </Key>
      <Key value="6" onPress={press} style={{ gridRow: 2, gridColumn: 3 }}>
        6
      </Key>
      <Key value="." onPress={press} style={{ gridRow: 2, gridColumn: 4 }}>
        <span className="text-2xl leading-none">·</span>
      </Key>

      {/* row 3: 1 2 3 C */}
      <Key value="1" onPress={press} style={{ gridRow: 3, gridColumn: 1 }}>
        1
      </Key>
      <Key value="2" onPress={press} style={{ gridRow: 3, gridColumn: 2 }}>
        2
      </Key>
      <Key value="3" onPress={press} style={{ gridRow: 3, gridColumn: 3 }}>
        3
      </Key>
      <Key
        value="clear"
        variant="clear"
        onPress={press}
        style={{ gridRow: 3, gridColumn: 4 }}
      >
        C
      </Key>

      {/* row 4: 0 (wide) 00 (wide) */}
      <Key
        value="0"
        onPress={press}
        style={{ gridRow: 4, gridColumn: '1 / span 2' }}
      >
        0
      </Key>
      <Key
        value="00"
        onPress={press}
        style={{ gridRow: 4, gridColumn: '3 / span 2' }}
      >
        00
      </Key>
    </div>
  );
};
NumberKeyboard.displayName = 'NumberKeyboard';

type KeyVariant = 'digit' | 'delete' | 'clear';

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
    variant === 'delete'
      ? 'bg-black/[0.04] text-[var(--color-expense)] border border-black/[0.08]'
      : 'bg-black/[0.04] text-gray-100 border border-black/[0.08]';

  return (
    <button
      type="button"
      style={style}
      className={`flex cursor-pointer items-center justify-center rounded-[14px] text-lg font-semibold transition-colors select-none active:scale-[0.97] sm:text-xl ${variantClass}`}
      onClick={() => onPress(value)}
    >
      {children}
    </button>
  );
};
