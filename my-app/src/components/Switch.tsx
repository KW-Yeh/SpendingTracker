'use client';

import {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useRef,
} from 'react';

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

  const containerRef = useRef<HTMLButtonElement>(null);
  const option1Ref = useRef<HTMLSpanElement>(null);
  const option2Ref = useRef<HTMLSpanElement>(null);
  const floatingBlockRef = useRef<HTMLDivElement>(null);

  const handleOnClick = useCallback(() => {
    startTransition(() => {
      if (value === option1.value) onChange(option2.value);
      else onChange(option1.value);
    });
  }, [onChange, value, option1.value, option2.value]);

  useEffect(() => {
    const container = containerRef.current;
    const leftButton = option1Ref.current;
    const rightButton = option2Ref.current;
    const block = floatingBlockRef.current;

    requestAnimationFrame(() => {
      if (container && leftButton && rightButton && block) {
        const leftWidth = leftButton.offsetWidth;
        const rightWidth = rightButton.offsetWidth;
        const leftLeft = leftButton.offsetLeft;
        const rightLeft = rightButton.offsetLeft;

        if (value === option1.value) {
          block.style.left = `${leftLeft}px`;
          block.style.width = `${leftWidth}px`;
          container.style.backgroundColor = option1.onSelectColor;
        } else {
          block.style.left = `${rightLeft}px`;
          block.style.width = `${rightWidth}px`;
          container.style.backgroundColor = option2.onSelectColor;
        }
      }
    });
  }, [option1.onSelectColor, option1.value, option2.onSelectColor, value]);

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={handleOnClick}
      className={`relative flex w-fit items-center gap-1 rounded-lg border border-solid border-text p-1 ${className}`}
    >
      <div
        ref={floatingBlockRef}
        className="absolute bottom-1 top-1 z-10 rounded bg-background transition-all"
      ></div>
      <span
        ref={option1Ref}
        className={`z-20 bg-transparent px-6 py-2 text-center font-semibold transition-colors ${option1.className} ${value === option1.value ? 'text-text' : 'text-gray-500 active:text-text sm:hover:text-text'}`}
      >
        {option1.label}
      </span>
      <span
        ref={option2Ref}
        className={`z-20 bg-transparent px-6 py-2 text-center font-semibold transition-colors ${option2.className} ${value === option2.value ? 'text-text' : 'text-gray-500 active:text-text sm:hover:text-text'}`}
      >
        {option2.label}
      </span>
    </button>
  );
};
