'use client';

import { useIDB } from '@/hooks/useIDB';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  startTransition,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  currentGroup?: Group;
  groups: Group[];
  syncGroup: (user_id: number) => void;
  setter: (_groups: Group[], userId?: number) => void;
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
  const { db, getGroupData, setGroupData } = useIDB();

  const handleState = useCallback((res: Group[]) => {
    setGroups(res);
    setLoading(false);
  }, []);

  // IDB-only: write to IDB + update local state
  const handleSetGroups = useCallback(
    (newGroups: Group[], userId?: number) => {
      startTransition(() => {
        handleState(newGroups);
      });
      if (db && userId) {
        setGroupData(db, userId, newGroups).catch(console.error);
      }
    },
    [db, setGroupData, handleState],
  );

  // IDB-only: read groups from IDB
  const syncGroup = useCallback(
    async (user_id: number) => {
      if (!db) {
        setLoading(true);
        return;
      }

      try {
        const cachedData = await getGroupData(db, user_id);
        if (cachedData) {
          startTransition(() => {
            setGroups(cachedData);
            setLoading(false);
          });
        } else {
          setGroups([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('[GroupProvider] Error reading IDB:', error);
        setLoading(false);
      }
    },
    [db, getGroupData],
  );

  const ctxVal = useMemo(
    () => ({
      loading,
      groups,
      currentGroup,
      setCurrentGroup,
      syncGroup,
      setter: handleSetGroups,
    }),
    [currentGroup, groups, loading, syncGroup, handleSetGroups],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGroupCtx = () => useContext(Ctx);
