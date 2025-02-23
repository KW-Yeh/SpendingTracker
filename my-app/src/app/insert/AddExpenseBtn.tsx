'use client';

import { useMounted } from '@/hooks/useMounted';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { v7 as uuid } from 'uuid';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  borderStyle?: string;
  autoClick: boolean;
}

export const AddExpenseBtn = (props: Props) => {
  const {
    className = '',
    borderStyle = 'bg-text',
    autoClick,
    children,
  } = props;
  const animationWrapperRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();
  const isMounted = useMounted();

  const handleOnClick = useCallback(() => {
    router.push('/edit', { scroll: false });
  }, [router]);

  useEffect(() => {
    if (autoClick) {
      handleOnClick();
    }
  }, [autoClick, handleOnClick]);

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
    <Link
      href="/edit"
      className={`transition-spring fixed bottom-8 z-30 mx-auto flex w-40 overflow-hidden rounded-full p-px shadow-md transition-all active:scale-105 sm:hover:scale-105 ${className}`}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      scroll={false}
    >
      <div
        ref={animationWrapperRef}
        className="absolute -bottom-14 -left-1 -right-1 -top-14 animate-spin"
        style={{
          animationDuration: '1.5s',
        }}
      >
        <div
          className={`${borderStyle} absolute bottom-0 left-0 right-0 top-0 animate-spin`}
          style={{
            animationDuration: '2s',
          }}
        ></div>
      </div>
      <div className="z-40 flex w-full items-center justify-center rounded-full bg-background p-4 font-bold">
        {!isMounted ? (
          <span className="text-base font-bold">準備中...</span>
        ) : (
          children
        )}
      </div>
    </Link>
  );
};
