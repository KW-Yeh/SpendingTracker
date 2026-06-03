'use client';

import { SWRegister } from '@/components/SWRegister';
import { usePrepareData } from '@/hooks/usePrepareData';
import { IDB_NAME } from '@/utils/constants';
import { useEffect } from 'react';

export const PrepareData = () => {
  usePrepareData();

  // One-time migration: the IndexedDB cache layer has been removed — delete
  // the legacy database left behind on existing devices. Idempotent and
  // harmless when the database no longer exists.
  useEffect(() => {
    try {
      indexedDB.deleteDatabase(IDB_NAME);
    } catch {
      /* ignore — cache cleanup is best-effort */
    }
  }, []);

  return <SWRegister />;
};
