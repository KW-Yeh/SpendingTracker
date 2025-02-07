'use client';

import { HTMLAttributes, useEffect, useRef, useState } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  borderStyle?: string;
  animationDuration?: {
    default: string;
    hover: string;
  };
}

export const AddExpenseBtn = (props: Props) => {
  const {
    className = '',
    borderStyle = 'bg-text',
    animationDuration = {
      default: '2s',
      hover: '1.5s',
    },
    children,
    ...legacy
  } = props;
  const animationWrapperRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const animationWrapper = animationWrapperRef.current;
    if (animationWrapper) {
      if (isHover) {
        requestAnimationFrame(() => {
          animationWrapper.style.animationPlayState = 'running';
        });
      } else {
        requestAnimationFrame(() => {
          animationWrapper.style.animationPlayState = 'paused';
        });
      }
    }
  }, [isHover]);

  return (
    <button
      type="button"
      className={`fixed bottom-8 z-30 mx-auto flex w-40 overflow-hidden rounded-full p-px shadow-md transition-all ${className}`}
      {...legacy}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      <div
        ref={animationWrapperRef}
        className="absolute -bottom-14 -left-1 -right-1 -top-14 animate-spin"
        style={{
          animationDuration: animationDuration.hover,
        }}
      >
        <div
          className={`${borderStyle} absolute bottom-0 left-0 right-0 top-0 animate-spin`}
          style={{
            animationDuration: animationDuration.default,
          }}
        ></div>
      </div>
      <div className="z-40 flex w-full items-center justify-center rounded-full bg-background p-4 font-bold">
        {children}
      </div>
    </button>
  );
};
