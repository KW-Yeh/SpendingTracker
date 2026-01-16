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
    <div className={`relative w-full md:max-w-80 ${className}`}>
      <div className="flex w-full items-center gap-1.5 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-all hover:border-primary-400 hover:shadow-warm">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className={`flex min-w-[44px] min-h-[44px] items-center justify-center border-r border-gray-200 text-gray-600 transition-all hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100 ${styles.navButton}`}
          aria-label="上個月"
        >
          <BiChevronLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex flex-1 items-center justify-center gap-2 py-2 min-h-[44px] transition-all ${
            open ? 'bg-primary-50' : 'hover:bg-gray-50'
          }`}
        >
          <CalendarIcon className={`size-5 transition-colors ${open ? 'text-primary-600' : 'text-gray-500'}`} />
          <div className="flex items-center gap-1.5">
            <span className={`text-base font-semibold transition-colors ${open ? 'text-primary-700' : 'text-gray-800'}`}>
              {year}
            </span>
            <span className="text-gray-400">/</span>
            <span className={`text-base font-semibold transition-colors ${open ? 'text-primary-700' : 'text-gray-800'}`}>
              {currentMonthName}
            </span>
          </div>
          {isCurrentMonth() && (
            <span className="ml-1 size-2 rounded-full bg-primary-500 shadow-warm"></span>
          )}
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          className={`flex min-w-[44px] min-h-[44px] items-center justify-center border-l border-gray-200 text-gray-600 transition-all hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100 ${styles.navButton}`}
          aria-label="下個月"
        >
          <BiChevronRight className="size-5" />
        </button>
      </div>

      {/* Dropdown panel */}
      <div
        ref={ref}
        className={`absolute top-full left-1/2 z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-warm-lg transition-all ${
          open
            ? `${styles.dropdownAnimation} visible opacity-100`
            : 'invisible translate-y-1 opacity-0'
        }`}
      >
        {/* Year selector */}
        <div className="border-b border-gray-100 bg-linear-to-r from-primary-50 to-accent-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setYear((Number(year) - 1).toString())}
              className="flex items-center justify-center rounded-lg p-1.5 text-primary-700 transition-all hover:bg-white/60 active:scale-95"
            >
              <BiChevronLeft className="size-5" />
            </button>

            <span className="text-xl font-bold text-primary-800">{year} 年</span>

            <button
              onClick={() => setYear((Number(year) + 1).toString())}
              className="flex items-center justify-center rounded-lg p-1.5 text-primary-700 transition-all hover:bg-white/60 active:scale-95"
            >
              <BiChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Month grid */}
        <div className="p-4">
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
                  className={`relative rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${styles.monthButton} ${
                    isSelected
                      ? 'bg-primary-500 text-white shadow-warm ring-2 ring-primary-200 scale-105'
                      : isCurrentYearMonth
                        ? 'bg-primary-100 text-primary-700 hover:bg-primary-200 hover:scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  {monthLabel}
                  {isCurrentYearMonth && !isSelected && (
                    <span className="absolute right-1 top-1 size-2 rounded-full bg-primary-500 shadow-warm"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3">
          <button
            onClick={() => {
              setYear((Number(year) - 1).toString());
            }}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-700"
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
            className="rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-warm transition-all hover:shadow-warm-lg hover:scale-105 active:scale-95"
          >
            回到本月
          </button>
        </div>
      </div>
    </div>
  );
};
