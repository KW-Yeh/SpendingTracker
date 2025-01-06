'use client';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getItems } from '@/services/dbHandler';
import {
  createContext,
  ReactNode,
  startTransition,
  useCallback,
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
  const { config, loading: loadingConfig } = useUserConfigCtx();
  const [data, setData] = useState<SpendingRecord[]>([]);

  const handleState = useCallback((res: SpendingRecord[]) => {
    startTransition(() => {
      setData(res.sort(sortData));
      setLoading(false);
    });
    startTransition(() => {
      setLoading(false);
    });
  }, []);

  const queryItem = useCallback(() => {
    getItems()
      .then((res) => res.json())
      .then((res: SpendingRecord[]) => {
        handleState(res);
      })
      .catch(console.error);
  }, [handleState]);

  const syncData = useCallback(() => {
    setLoading(true);
    if (!loadingConfig && config) {
      queryItem();
    }
  }, [queryItem, config, loadingConfig]);

  const ctxVal = useMemo(
    () => ({
      loading,
      data,
      syncData,
    }),
    [loading, data, syncData],
  );

  useEffect(() => {
    if (!loadingConfig && config) {
      queryItem();
    }
  }, [config, loadingConfig, queryItem]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);

const sortData = (a: SpendingRecord, b: SpendingRecord) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
};
