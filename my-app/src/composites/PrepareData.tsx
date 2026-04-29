'use client';

import { SWRegister } from '@/components/SWRegister';
import { usePrepareData } from '@/hooks/usePrepareData';

export const PrepareData = () => {
  usePrepareData();
  return <SWRegister />;
};
