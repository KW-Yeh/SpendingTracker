'use client';

import { getGroups } from '@/services/groupServices';
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
  currentGroup?: Group;
  groups: Group[];
  syncGroup: (groupId: string | string[]) => void;
  setter: (_groups: Group[]) => void;
  setCurrentGroup: (_group?: Group) => void;
} = {
  loading: true,
  currentGroup: undefined,
  groups: [],
  syncGroup: () => {},
  setter: () => {},
  setCurrentGroup: () => {},
};

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group>();

  const handleState = (res: Group[]) => {
    setGroups(res);
    setLoading(false);
  };

  const queryGroup = useCallback((groupId: string | string[]) => {
    setLoading(true);
    getGroups(groupId)
      .then(({ data: res }) => {
        handleState(res);
      })
      .catch(console.error);
  }, []);

  const ctxVal = useMemo(
    () => ({
      loading,
      groups,
      currentGroup,
      setCurrentGroup,
      syncGroup: queryGroup,
      setter: handleState,
    }),
    [currentGroup, groups, loading, queryGroup],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGroupCtx = () => useContext(Ctx);
