'use client';

import { ReactNode, startTransition, useEffect, useRef } from 'react';

interface Props {
  option1: Option;
  option2: Option;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

type Option = {
  label: ReactNode;
  value: string;
  onSelectColor: string;
  className?: string;
};

export const Switch = (props: Props) => {
  const { option1, option2, value, className = '', onChange } = props;

  const option1Ref = useRef<HTMLButtonElement>(null);
  const option2Ref = useRef<HTMLButtonElement>(null);
  const floatingBlockRef = useRef<HTMLDivElement>(null);

  const handleOnClick = (type: string) => {
    startTransition(() => {
      onChange(type);
    });
  };

  useEffect(() => {
    const leftButton = option1Ref.current;
    const rightButton = option2Ref.current;
    const block = floatingBlockRef.current;

    requestAnimationFrame(() => {
      if (leftButton && rightButton && block) {
        const leftWidth = leftButton.offsetWidth;
        const rightWidth = rightButton.offsetWidth;
        const leftLeft = leftButton.offsetLeft;
        const rightLeft = rightButton.offsetLeft;

        if (value === option1.value) {
          block.style.left = `${leftLeft}px`;
          block.style.width = `${leftWidth}px`;
          block.style.backgroundColor = option1.onSelectColor;
        } else {
          block.style.left = `${rightLeft}px`;
          block.style.width = `${rightWidth}px`;
          block.style.backgroundColor = option2.onSelectColor;
        }
      }
    });
  }, [option1.onSelectColor, option1.value, option2.onSelectColor, value]);

  return (
    <div
      className={`relative flex w-fit items-center gap-1 rounded-lg border border-solid border-text p-1 ${className}`}
    >
      <div
        ref={floatingBlockRef}
        className="absolute bottom-1 top-1 z-10 rounded transition-all"
      ></div>
      <button
        ref={option1Ref}
        type="button"
        className={`z-20 bg-transparent px-6 py-2 text-center font-semibold transition-colors ${option1.className} ${value === option1.value ? 'text-text' : 'text-gray-500 active:text-text sm:hover:text-text'}`}
        onClick={() => handleOnClick(option1.value)}
      >
        {option1.label}
      </button>
      <button
        ref={option2Ref}
        type="button"
        className={`z-20 bg-transparent px-6 py-2 text-center font-semibold transition-colors ${option2.className} ${value === option2.value ? 'text-text' : 'text-gray-500 active:text-text sm:hover:text-text'}`}
        onClick={() => handleOnClick(option2.value)}
      >
        {option2.label}
      </button>
    </div>
  );
};
