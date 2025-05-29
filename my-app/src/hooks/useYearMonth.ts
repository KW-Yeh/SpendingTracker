'use client';

import { useState } from 'react';

export const useYearMonth = (today: Date) => {
  const [year, setYear] = useState(`${today.getFullYear()}`);
  const [month, setMonth] = useState(`${today.getMonth() + 1}`);
  return {
    today: new Date(Number(year), Number(month) - 1),
    year,
    setYear,
    month,
    setMonth,
  };
};
