'use client';

import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { WEEKDAY } from '@/utils/constants';
import { ChangeEvent, useMemo, useRef } from 'react';

interface Props {
  date: Date;
  onChange: (event: ChangeEvent) => void;
  className?: string;
  labelClassName?: string;
  format?: 'wording' | 'yyyy-mm-dd' | 'yyyy/mm/dd';
}

export const DatePicker = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const year = props.date.getFullYear();
  const month = props.date.getMonth();
  const day = props.date.getDate();
  const weekday = props.date.getDay();

  const wording = useMemo(() => {
    if (props.format === 'yyyy-mm-dd') {
      return `${year}-${month + 1}-${day}`;
    } else if (props.format === 'yyyy/mm/dd') {
      return `${year}/${month + 1}/${day}`;
    }
    return `${year} 年 ${month + 1} 月 ${day} 日（週${WEEKDAY[weekday]}）`;
  }, [year, month, day, weekday, props.format]);

  const showPicker = () => {
    if (!inputRef.current) return;
    inputRef.current.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
    );
    inputRef.current.focus();
    inputRef.current.click();
    inputRef.current.showPicker();
  };

  return (
    <div className={`relative flex items-center ${props.className}`}>
      <input
        ref={inputRef}
        type="date"
        className="absolute top-0 right-0 bottom-0 left-0 opacity-0"
        onChange={props.onChange}
      />
      <button
        type="button"
        className={`z-20 flex w-full items-center justify-between gap-4 ${props.labelClassName}`}
        onClick={showPicker}
      >
        <span>{wording}</span>
        <CalendarIcon className="size-4" />
      </button>
    </div>
  );
};
