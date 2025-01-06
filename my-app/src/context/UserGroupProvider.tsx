'use client';

import { getGroups } from '@/services/dbHandler';
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
  groups: Group[];
  syncGroup: () => void;
} = {
  loading: true,
  groups: [],
  syncGroup: () => {},
};

export const UserGroupProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);

  const handleState = (res: Group[]) => {
    setGroups(res);
    startTransition(() => {
      setLoading(false);
    });
  };

  const queryGroup = useCallback(() => {
    getGroups()
      .then((res) => res.json())
      .then((res: Group[]) => {
        handleState(res);
      })
      .catch(console.error);
  }, []);

  const syncGroup = useCallback(() => {
    setLoading(true);
    queryGroup();
  }, [queryGroup]);

  const ctxVal = useMemo(
    () => ({
      loading,
      groups,
      syncGroup,
    }),
    [groups, loading, syncGroup],
  );

  useEffect(() => {
    syncGroup();
  }, [syncGroup]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGroupCtx = () => useContext(Ctx);
