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
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="date"
        className="absolute inset-0 size-full cursor-pointer opacity-0"
        onChange={handleOnChangeDate}
      />
      <button
        type="button"
        className={`relative z-10 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-primary-400 hover:bg-gray-50 active:scale-[0.98] ${labelClassName}`}
        onClick={showPicker}
      >
        <CalendarIcon className="size-4 text-gray-500" />
        <span className="text-center">{wording}</span>
      </button>
    </div>
  );
};
