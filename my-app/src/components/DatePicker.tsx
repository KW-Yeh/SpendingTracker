'use client';

import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { useDateCtx } from '@/context/DateProvider';
import { WEEKDAY } from '@/utils/constants';
import { ChangeEvent, useMemo, useRef } from 'react';

interface Props {
  className?: string;
  labelClassName?: string;
  format?: 'wording' | 'yyyy-mm-dd' | 'yyyy/mm/dd';
}

export const DatePicker = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { date, setDate } = useDateCtx();

  const year = useMemo(() => date.getFullYear(), [date]);
  const month = useMemo(() => date.getMonth(), [date]);
  const day = useMemo(() => date.getDate(), [date]);
  const weekday = useMemo(() => date.getDay(), [date]);

  const wording = useMemo(() => {
    if (props.format === 'yyyy-mm-dd') {
      return `${year}-${month + 1}-${day}`;
    } else if (props.format === 'yyyy/mm/dd') {
      return `${year}/${month + 1}/${day}`;
    }
    return `${year} 年 ${month + 1} 月 ${day} 日（週${WEEKDAY[weekday]}）`;
  }, [year, month, day, weekday, props.format]);

  const handleOnChangeDate = (event: ChangeEvent) => {
    const newDate = new Date((event.target as HTMLInputElement).value);
    setDate(newDate);
  };

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
        onChange={handleOnChangeDate}
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
