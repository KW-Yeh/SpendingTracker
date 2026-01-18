'use client';

import { GRAY_COLORS } from '@/styles/colors';
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
          leftButton.style.color = 'white';
          rightButton.style.color = GRAY_COLORS[500];
        } else {
          block.style.left = `${rightLeft}px`;
          block.style.width = `${rightWidth}px`;
          rightButton.style.color = 'white';
          leftButton.style.color = GRAY_COLORS[500];
        }
      }
    });
  }, [option1.value, value]);

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={handleOnClick}
      className={`relative flex w-fit items-center rounded-md p-1 ${className}`}
    >
      <div
        ref={floatingBlockRef}
        className="transition-spring bg-primary-500 absolute top-1 bottom-1 z-10 rounded transition-all"
      ></div>
      <span
        ref={option1Ref}
        className={`z-20 flex-1 bg-transparent px-2 py-1 text-center font-normal whitespace-nowrap transition-colors`}
      >
        {option1.label}
      </span>
      <span
        ref={option2Ref}
        className={`z-20 flex-1 bg-transparent px-2 py-1 text-center font-normal whitespace-nowrap transition-colors`}
      >
        {option2.label}
      </span>
    </button>
  );
};
