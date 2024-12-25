'use client';
import { getItems } from '@/services/dbHandler';
import { useSession } from 'next-auth/react';
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
  syncData: (userToken: string) => void;
} = {
  loading: true,
  data: [],
  syncData: () => {},
};

export const SpendingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [data, setData] = useState<SpendingRecord[]>([]);

  const handleState = (res: SpendingRecord[], userToken: string) => {
    startTransition(() => {
      setData(res.filter((d) => d['user-token'] === userToken));
      setLoading(false);
    });
  };

  const queryItem = (userToken: string) => {
    getItems()
      .then((res) => res.json())
      .then((res: SpendingRecord[]) => {
        handleState(res, userToken);
      })
      .catch(console.error);
  };

  const syncData = (userToken: string) => {
    startTransition(() => {
      queryItem(userToken);
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
    if (session?.user?.email) {
      syncData(session.user.email);
    }
  }, [session?.user?.email]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGetSpendingCtx = () => useContext(Ctx);
