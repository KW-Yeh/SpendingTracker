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
      <div className="hover:border-primary-400 flex w-full items-center gap-1.5 overflow-hidden rounded-xl border border-gray-600 bg-gray-800/90 shadow-sm backdrop-blur-sm transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className={`hover:text-primary-400 flex min-h-11 min-w-11 items-center justify-center border-r border-gray-600 text-gray-400 transition-all hover:bg-gray-700/70 active:bg-gray-700 ${styles.navButton}`}
          aria-label="上個月"
        >
          <BiChevronLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 py-2 transition-all ${
            open ? 'bg-primary-500/20' : 'hover:bg-gray-700/50'
          }`}
        >
          <CalendarIcon
            className={`size-5 transition-colors ${open ? 'text-primary-400' : 'text-gray-400'}`}
          />
          <div className="flex items-center gap-1.5">
            <span
              className={`text-base font-semibold transition-colors ${open ? 'text-primary-400' : 'text-gray-200'}`}
            >
              {year}
            </span>
            <span className="text-gray-500">/</span>
            <span
              className={`text-base font-semibold transition-colors ${open ? 'text-primary-400' : 'text-gray-200'}`}
            >
              {currentMonthName}
            </span>
          </div>
          {isCurrentMonth() && (
            <span className="bg-primary-500 ml-1 size-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
          )}
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          className={`hover:text-primary-400 flex min-h-11 min-w-11 items-center justify-center border-l border-gray-600 text-gray-400 transition-all hover:bg-gray-700/70 active:bg-gray-700 ${styles.navButton}`}
          aria-label="下個月"
        >
          <BiChevronRight className="size-5" />
        </button>
      </div>

      {/* Dropdown panel */}
      <div
        ref={ref}
        className={`absolute top-full left-1/2 z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-600 bg-gray-800/95 shadow-xl backdrop-blur-sm transition-all ${
          open
            ? `${styles.dropdownAnimation} visible opacity-100`
            : 'invisible translate-y-1 opacity-0'
        }`}
      >
        {/* Year selector */}
        <div className="from-primary-500/20 to-accent-500/20 border-b border-gray-600 bg-linear-to-r px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setYear((Number(year) - 1).toString())}
              className="text-primary-400 flex items-center justify-center rounded-lg p-1.5 transition-all hover:bg-gray-700/60 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] active:bg-gray-700"
            >
              <BiChevronLeft className="size-5" />
            </button>

            <span className="text-primary-300 text-xl font-bold">
              {year} 年
            </span>

            <button
              onClick={() => setYear((Number(year) + 1).toString())}
              className="text-primary-400 flex items-center justify-center rounded-lg p-1.5 transition-all hover:bg-gray-700/60 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] active:bg-gray-700"
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
                      ? 'bg-primary-500 ring-primary-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] ring-2'
                      : isCurrentYearMonth
                        ? 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'hover:text-primary-400 text-gray-300 hover:bg-gray-700/70 hover:shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                  }`}
                >
                  {monthLabel}
                  {isCurrentYearMonth && !isSelected && (
                    <span className="bg-primary-500 absolute top-1 right-1 size-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center justify-between border-t border-gray-600 bg-gray-700/50 px-4 py-3">
          <button
            onClick={() => {
              setYear((Number(year) - 1).toString());
            }}
            className="hover:text-primary-400 text-sm font-medium text-gray-400 transition-colors"
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
            className="from-primary-500 to-primary-600 shadow-warm hover:shadow-warm-lg rounded-xl bg-linear-to-r px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 active:brightness-100"
          >
            回到本月
          </button>
        </div>
      </div>
    </div>
  );
};
