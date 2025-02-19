'use client';

import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

export const useDate = (
  init?: Date,
): [Date, Dispatch<SetStateAction<Date>>] => {
  const { data } = useSession();
  const [date, setDate] = useState<Date>(init ?? new Date());
  const currentDateRef = useRef(init ?? new Date());

  useEffect(() => {
    if (currentDateRef.current.getDate() !== new Date().getDate()) {
      setDate(new Date());
      currentDateRef.current = new Date();
    }
  }, [data]);

  return [date, setDate];
};
