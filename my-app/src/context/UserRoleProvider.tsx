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
  group?: Group;
  groups: Group[];
  setGroup: (group?: Group) => void;
  syncGroup: () => void;
} = {
  loading: true,
  group: undefined,
  groups: [],
  setGroup: () => {},
  syncGroup: () => {},
};

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group>();
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
      group,
      groups,
      setGroup,
      syncGroup,
    }),
    [group, groups, loading, syncGroup],
  );

  useEffect(() => {
    syncGroup();
  }, [syncGroup]);

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useRoleCtx = () => useContext(Ctx);
