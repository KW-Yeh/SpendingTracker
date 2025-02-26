'use client';

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
      const queryString = new URLSearchParams({});
      if (email) queryString.set('email', email);
      if (groupId) queryString.set('groupId', groupId);
      if (time) queryString.set('time', time);

      fetch(`/api/aws/items?${queryString.toString()}`)
        .then((res) => res.json())
        .then((res) => {
          handleState(res);
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
