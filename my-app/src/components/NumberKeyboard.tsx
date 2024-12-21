'use client';

import { ReactNode, useCallback, useState } from 'react';

interface Props {
  default?: number;
  onConfirm: (num: number) => void;
}

export const NumberKeyboard = (props: Props) => {
  const [amount, setAmount] = useState((props.default ?? 0) + '');
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
      props.onConfirm(Number(amount));
    } catch {
      alert('Invalid amount');
    }
  }, [props.onConfirm, amount]);

  return (
    <div className="flex flex-col p-4 text-sm sm:text-base">
      <p className="mb-2 mt-1 rounded-md border-2 border-solid border-text p-4 text-end font-bold">
        {amount}
      </p>
      <div className="grid grid-cols-3 gap-1">
        <Key value="clear" className="col-span-1" onClick={handleOnClick}>
          清除
        </Key>
        <Key value="delete" className="col-span-2" onClick={handleOnClick}>
          刪除
        </Key>
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map((key) => (
          <Key
            key={key}
            value={key}
            className="col-span-1"
            onClick={handleOnClick}
          >
            {key}
          </Key>
        ))}
        <Key
          value="enter"
          className="col-span-2 bg-green-300 hover:bg-green-500"
          onClick={handleSubmit}
        >
          確定
        </Key>
      </div>
    </div>
  );
};

const Key = (props: {
  children: ReactNode;
  value: string;
  onClick: (val: string) => void;
  className?: string;
}) => {
  return (
    <button
      className={`${props.className} flex select-none items-center justify-center rounded-md border border-solid border-text p-3 transition-colors hover:bg-primary-100 active:bg-primary-300`}
      onClick={() => props.onClick(props.value)}
    >
      <span>{props.children}</span>
    </button>
  );
};
