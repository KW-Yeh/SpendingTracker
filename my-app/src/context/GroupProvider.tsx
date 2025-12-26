'use client';

import { getGroups } from '@/services/groupServices';
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
  const { db, getGroupData, setGroupData } = useIDB();

  const handleState = useCallback((res: Group[]) => {
    setGroups(res);
    setLoading(false);
  }, []);

  // Stale-While-Revalidate strategy
  const queryGroup = useCallback(
    async (user_id: number) => {
      if (!db) {
        // Fallback to direct API call if IndexedDB not ready
        setLoading(true);
        getGroups(user_id)
          .then((res) => {
            if (res.status) {
              handleState(res.data);
            }
          })
          .catch(console.error);
        return;
      }

      // Try to get cached data first
      try {
        const cachedData = await getGroupData(db, user_id);
        if (cachedData) {
          // Show cached data immediately (stale)
          console.log('[GroupProvider] Using cached group data');
          startTransition(() => {
            setGroups(cachedData);
            setLoading(false);
          });
        } else {
          // No cache, show loading
          setLoading(true);
        }
      } catch (error) {
        console.error('[GroupProvider] Error reading cache:', error);
        setLoading(true);
      }

      // Always fetch fresh data in background (revalidate)
      getGroups(user_id)
        .then((res) => {
          if (res.status) {
            // Update UI with fresh data
            startTransition(() => {
              handleState(res.data);
            });
            // Update cache
            setGroupData(db, user_id, res.data).catch(console.error);
          }
        })
        .catch(console.error);
    },
    [db, getGroupData, setGroupData, handleState],
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
