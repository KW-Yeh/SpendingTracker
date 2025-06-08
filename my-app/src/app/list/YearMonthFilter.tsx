'use client';

import { CalendarIcon } from '@/components/icons/CalendarIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { MONTH_LABEL, MONTH_MAP } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';

interface Props {
  refreshData: (
    groupId: string | undefined,
    year: string,
    month: string,
  ) => void;
  group?: Group;
  dateOptions: {
    today: Date;
    year: string;
    setYear: (year: string) => void;
    month: string;
    setMonth: (month: string) => void;
  };
  className?: string;
}

export const YearMonthFilter = (props: Props) => {
  const { refreshData, group, dateOptions, className = '' } = props;
  const { setYear, year, setMonth, month } = dateOptions;
  const [open, setOpen] = useState(false);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpen(false);
  });

  useEffect(() => {
    refreshData(group?.id, year, month);
  }, [group?.id, year, month, refreshData]);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-background border-text flex items-center gap-2 rounded-full border border-solid px-4 py-2"
      >
        <CalendarIcon className="size-4 sm:size-5" />
        <span className="w-12 text-end">{MONTH_MAP[month]}</span>
        <span className="w-14">{year}</span>
      </button>
      <div
        ref={ref}
        className={`bg-background border-text absolute left-1/2 z-10 mt-4 flex w-55 -translate-x-1/2 flex-col rounded-md border border-solid p-3 shadow transition-all ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <a
            onClick={() => {
              setYear((Number(year) - 1).toString());
            }}
            className="flex size-4 cursor-pointer items-center justify-center rounded border border-solid border-gray-300 p-1 text-gray-300 transition-colors hover:border-gray-500 hover:text-gray-500 sm:size-5"
          >
            <BiSolidLeftArrow />
          </a>
          <span>{year}</span>
          <a
            onClick={() => {
              setYear((Number(year) + 1).toString());
            }}
            className="flex size-4 cursor-pointer items-center justify-center rounded border border-solid border-gray-300 p-1 text-gray-300 transition-colors hover:border-gray-500 hover:text-gray-500 sm:size-5"
          >
            <BiSolidRightArrow />
          </a>
        </div>
        <div className="mt-4 grid w-full grid-cols-3 gap-3">
          {Object.keys(MONTH_LABEL).map((monthLabel) => (
            <a
              key={monthLabel}
              onClick={() => setMonth(MONTH_LABEL[monthLabel])}
              className={`col-span-1 cursor-pointer rounded-md px-2 py-1 text-center transition-colors ${MONTH_LABEL[monthLabel] === month ? 'bg-primary-500 text-background' : 'hover:bg-primary-500 hover:text-background'}`}
            >
              {monthLabel}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
