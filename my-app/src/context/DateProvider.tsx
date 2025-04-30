'use client';

import { useDate } from '@/hooks/useDate';
import { createContext, ReactNode, useContext, useMemo } from 'react';

interface CtxValue {
  date: Date;
  setDate: (date: Date) => void;
}

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useDate(new Date());

  const ctxValue = useMemo(
    () => ({
      date,
      setDate,
    }),
    [date, setDate],
  );

  return <Ctx.Provider value={ctxValue}>{children}</Ctx.Provider>;
};

const Ctx = createContext<CtxValue>({
  date: new Date(),
  setDate: () => {},
});

export const useDateCtx = () => useContext(Ctx);
