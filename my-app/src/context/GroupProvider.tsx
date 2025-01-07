'use client';

import { getGroups } from '@/services/dbHandler';
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
  groups: Group[];
  syncGroup: (groupId?: string | string[]) => void;
} = {
  loading: true,
  groups: [],
  syncGroup: () => {},
};

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);

  const handleState = (res: Group[]) => {
    setGroups(res);
    startTransition(() => {
      setLoading(false);
    });
  };

  const queryGroup = useCallback((groupId?: string | string[]) => {
    getGroups(groupId)
      .then((res) => {
        handleState(res);
      })
      .catch(console.error);
  }, []);

  const syncGroup = useCallback(
    (groupId?: string | string[]) => {
      setLoading(true);
      queryGroup(groupId);
    },
    [queryGroup],
  );

  const ctxVal = useMemo(
    () => ({
      loading,
      groups,
      syncGroup,
    }),
    [groups, loading, syncGroup],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGroupCtx = () => useContext(Ctx);
