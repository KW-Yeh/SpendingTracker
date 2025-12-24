'use client';

import { CalendarIcon } from '@/components/icons/CalendarIcon';
import useFocusRef from '@/hooks/useFocusRef';
import { MONTH_LABEL, MONTH_MAP } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import styles from './YearMonthFilter.module.css';

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
    refreshData(
      group?.account_id ? String(group.account_id) : undefined,
      year,
      month,
    );
  }, [group?.account_id, year, month, refreshData]);

  const handlePreviousMonth = () => {
    if (month === '1') {
      setMonth('12');
      setYear((Number(year) - 1).toString());
    } else {
      setMonth((Number(month) - 1).toString());
    }
    setOpen(false);
  };

  const handleNextMonth = () => {
    if (month === '12') {
      setMonth('1');
      setYear((Number(year) + 1).toString());
    } else {
      setMonth((Number(month) + 1).toString());
    }
    setOpen(false);
  };

  const currentMonthName = MONTH_MAP[month];
  const isCurrentMonth = () => {
    const today = new Date();
    return (
      today.getFullYear().toString() === year &&
      (today.getMonth() + 1).toString() === month
    );
  };

  return (
    <div
      className={`relative ${className} transition-all ${
        open
          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
          : 'hover:border-primary-300 hover:bg-primary-50 border-gray-300 bg-white text-gray-800'
      }`}
    >
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className={`flex items-center justify-center rounded-full p-1.5 text-gray-600 transition-all hover:bg-gray-100 active:bg-gray-200 ${styles.navButton}`}
          aria-label="上個月"
        >
          <BiChevronLeft className="size-6" />
        </button>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`flex flex-1 items-center justify-center gap-3 rounded-lg px-4 py-2`}
        >
          <CalendarIcon className="text-primary-500 size-5" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-medium">{currentMonthName}</span>
            <span className="text-sm text-gray-500">{year}</span>
          </div>
          {isCurrentMonth() && (
            <span className="bg-primary-100 text-primary-700 ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium">
              本月
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          className={`flex items-center justify-center rounded-full p-1.5 text-gray-600 transition-all hover:bg-gray-100 active:bg-gray-200 ${styles.navButton}`}
          aria-label="下個月"
        >
          <BiChevronRight className="size-6" />
        </button>
      </div>

      {/* Dropdown panel */}
      <div
        ref={ref}
        className={`absolute top-full left-1/2 z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg ${
          open
            ? `${styles.dropdownAnimation} visible opacity-100`
            : 'invisible opacity-0'
        }`}
      >
        {/* Year selector */}
        <div className="bg-primary-50 mb-4 flex items-center justify-between rounded-md p-2">
          <button
            onClick={() => setYear((Number(year) - 1).toString())}
            className="flex items-center justify-center rounded-md p-1.5 text-gray-700 transition-all hover:bg-white"
          >
            <BiChevronLeft className="size-5" />
          </button>

          <span className="text-primary-700 text-lg font-bold">{year}</span>

          <button
            onClick={() => setYear((Number(year) + 1).toString())}
            className="flex items-center justify-center rounded-md p-1.5 text-gray-700 transition-all hover:bg-white"
          >
            <BiChevronRight className="size-5" />
          </button>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(MONTH_LABEL).map((monthLabel) => {
            const isSelected = MONTH_LABEL[monthLabel] === month;
            const isCurrentYearMonth =
              new Date().getFullYear().toString() === year &&
              MONTH_LABEL[monthLabel] ===
                (new Date().getMonth() + 1).toString();

            return (
              <button
                key={monthLabel}
                onClick={() => {
                  setMonth(MONTH_LABEL[monthLabel]);
                  setOpen(false);
                }}
                className={`relative rounded-md px-2 py-2 text-center font-medium transition-all ${styles.monthButton} ${
                  isSelected
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-primary-100 hover:text-primary-700 text-gray-700'
                }`}
              >
                {monthLabel}
                {isCurrentYearMonth && !isSelected && (
                  <span className="bg-primary-500 absolute -top-1 -right-1 size-2 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mt-4 flex justify-between border-t border-gray-100 pt-3">
          <button
            onClick={() => {
              // Go to previous year, same month
              setYear((Number(year) - 1).toString());
            }}
            className="hover:text-primary-700 text-sm font-medium text-gray-600"
          >
            去年同月
          </button>

          <button
            onClick={() => {
              const today = new Date();
              setMonth((today.getMonth() + 1).toString());
              setYear(today.getFullYear().toString());
              setOpen(false);
            }}
            className="bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-md px-3 py-1 text-sm font-medium"
          >
            回到本月
          </button>
        </div>
      </div>
    </div>
  );
};
