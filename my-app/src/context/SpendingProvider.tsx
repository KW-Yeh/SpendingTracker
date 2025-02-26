'use client';

import { getItems } from '@/services/recordActions';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  data: SpendingRecord[];
  syncData: (groupId?: string, email?: string, time?: string) => void;
  setter: (res: SpendingRecord[]) => void;
} = {
  loading: true,
  data: [],
  syncData: () => {},
  setter: () => {},
};

export const SpendingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SpendingRecord[]>([]);

  const handleState = useCallback((res: SpendingRecord[]) => {
    setData(res);
    setLoading(false);
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
      setter: handleState,
    }),
    [loading, data, syncData, handleState],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);
