'use client';

import { getItems } from '@/services/recordActions';
import {
  createContext,
  ReactNode,
  startTransition,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  data: SpendingRecord[];
  syncData: (groupId?: string, email?: string, time?: string) => void;
} = {
  loading: true,
  data: [],
  syncData: () => {},
};

export const SpendingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SpendingRecord[]>([]);

  const handleState = useCallback((res: SpendingRecord[]) => {
    startTransition(() => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const queryItem = useCallback(
    (email?: string, groupId?: string, time?: string) => {
      if (!email && !groupId) return;
      getItems(groupId, email, time)
        .then((res) => {
          handleState(res.data);
        })
        .catch(console.error);
    },
    [handleState],
  );

  const syncData = useCallback(
    (groupId?: string, email?: string, time?: string) => {
      setLoading(true);
      queryItem(email, groupId, time);
    },
    [queryItem],
  );

  const ctxVal = useMemo(
    () => ({
      loading,
      data,
      syncData,
    }),
    [loading, data, syncData],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);
