'use client';

import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { useDateCtx } from '@/context/DateProvider';
import { WEEKDAY } from '@/utils/constants';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  className?: string;
  labelClassName?: string;
  format?: 'wording' | 'yyyy-mm-dd' | 'yyyy/mm/dd';
  init?: Date;
}

export const DatePicker = (props: Props) => {
  const { init = new Date(), format, className, labelClassName } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const { date, setDate } = useDateCtx();
  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getFullYear());
  const [day, setDay] = useState(init.getFullYear());
  const [weekday, setWeekday] = useState(init.getFullYear());

  useEffect(() => {
    setYear(date.getFullYear());
    setMonth(date.getMonth());
    setDay(date.getDate());
    setWeekday(date.getDay());
  }, [date]);

  const wording = useMemo(() => {
    if (format === 'yyyy-mm-dd') {
      return `${year}-${month + 1}-${day}`;
    } else if (format === 'yyyy/mm/dd') {
      return `${year}/${month + 1}/${day}`;
    }
    return `${year} 年 ${month + 1} 月 ${day} 日（週${WEEKDAY[weekday]}）`;
  }, [year, month, day, weekday, format]);

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
    <div className={`relative flex items-center ${className}`}>
      <input
        ref={inputRef}
        type="date"
        className="absolute top-0 right-0 bottom-0 left-0 opacity-0"
        onChange={handleOnChangeDate}
      />
      <button
        type="button"
        className={`z-20 flex w-full items-center justify-between gap-4 ${labelClassName}`}
        onClick={showPicker}
      >
        <span>{wording}</span>
        <CalendarIcon className="size-4" />
      </button>
    </div>
  );
};
