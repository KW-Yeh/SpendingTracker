'use client';

import { useDateCtx } from '@/context/DateProvider';

export const useYearMonth = (_today?: Date) => {
  const { year, month, setYear, setMonth } = useDateCtx();
  return {
    today: new Date(Number(year), Number(month) - 1),
    year,
    setYear,
    month,
    setMonth,
  };
};
