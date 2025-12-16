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
  syncGroup: (user_id: number) => void;
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

  const handleState = useCallback((res: Group[]) => {
    setGroups(res);
    setLoading(false);
  }, []);

  const queryGroup = useCallback(
    (user_id: number) => {
      setLoading(true);
      getGroups(user_id)
        .then((res) => {
          if (res.status) {
            handleState(res.data);
          }
        })
        .catch(console.error);
    },
    [handleState],
  );

  const ctxVal = useMemo(
    () => ({
      loading,
      groups,
      currentGroup,
      setCurrentGroup,
      syncGroup: queryGroup,
      setter: handleState,
    }),
    [currentGroup, groups, loading, queryGroup, handleState],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGroupCtx = () => useContext(Ctx);
