'use client';
import { getItems } from '@/services/dbHandler';
import {
  createContext,
  ReactNode,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  data: SpendingRecord[];
  syncData: () => void;
} = {
  loading: true,
  data: [],
  syncData: () => {},
};

export const SpendingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SpendingRecord[]>([]);

  const syncData = () => {
    startTransition(() => {
      getItems()
        .then((res) => res.json())
        .then((res) => {
          startTransition(() => {
            setData(res);
            setLoading(false);
          });
        })
        .catch(console.error);
    });
  };

  const ctxVal = useMemo(
    () => ({
      loading,
      data,
      syncData,
    }),
    [loading, data],
  );

  useEffect(() => {
    syncData();
  }, []);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);
