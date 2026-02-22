'use client';

import { useIDB } from '@/hooks/useIDB';
import { getGroups } from '@/services/groupServices';
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

  // Update local state + IDB cache
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

  // Cloud-first: fetch from API, show IDB cache first
  const syncGroup = useCallback(
    async (user_id: number) => {
      setLoading(true);

      // Show IDB cache first for fast render
      if (db) {
        try {
          const cachedData = await getGroupData(db, user_id);
          if (cachedData) {
            startTransition(() => {
              setGroups(cachedData);
              setLoading(false);
            });
          }
        } catch {
          // IDB cache miss is fine
        }
      }

      // Fetch from API (source of truth)
      try {
        const res = await getGroups(user_id);
        if (res.status && res.data) {
          startTransition(() => {
            handleState(res.data);
          });
          // Update IDB cache
          if (db) {
            await setGroupData(db, user_id, res.data);
          }
        }
      } catch (error) {
        console.error('[GroupProvider] Error fetching from API:', error);
        setLoading(false);
      }
    },
    [db, getGroupData, setGroupData, handleState],
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
