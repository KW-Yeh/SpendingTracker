'use client';

import { useIDBCtx } from '@/context/IDBProvider';

// Backwards-compatible shim. All consumers now share one IDB connection
// (opened by <IDBProvider /> in the layout).
export const useIDB = () => useIDBCtx();
