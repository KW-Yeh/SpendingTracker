'use client';

import { useDate } from '@/hooks/useDate';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface CtxValue {
  date: Date;
  setDate: (date: Date) => void;
  year: string;
  month: string;
  setYear: (year: string) => void;
  setMonth: (month: string) => void;
}

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useDate(new Date());
  const today = new Date();
  const [year, setYear] = useState(`${today.getFullYear()}`);
  const [month, setMonth] = useState(`${today.getMonth() + 1}`);

  const ctxValue = useMemo(
    () => ({
      date,
      setDate,
      year,
      month,
      setYear,
      setMonth,
    }),
    [date, setDate, year, month, setYear, setMonth],
  );

  return <Ctx.Provider value={ctxValue}>{children}</Ctx.Provider>;
};

const Ctx = createContext<CtxValue>({
  date: new Date(),
  setDate: () => {},
  year: `${new Date().getFullYear()}`,
  month: `${new Date().getMonth() + 1}`,
  setYear: () => {},
  setMonth: () => {},
});

export const useDateCtx = () => useContext(Ctx);
