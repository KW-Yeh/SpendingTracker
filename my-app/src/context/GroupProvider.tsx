'use client';

import { getGroups } from '@/services/groupServices';
import {
  getCachedCurrentGroup,
  getCachedGroups,
  setCachedCurrentGroup,
  setCachedGroups,
} from '@/utils/localCache';
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
  isFetching: boolean;
  hasEverLoaded: boolean;
  currentGroup?: Group;
  groups: Group[];
  syncGroup: (user_id: number) => void;
  setter: (_groups: Group[], userId?: number) => void;
  setCurrentGroup: (_group?: Group) => void;
} = {
  loading: true,
  isFetching: false,
  hasEverLoaded: false,
  currentGroup: undefined,
  groups: [],
  syncGroup: () => {},
  setter: () => {},
  setCurrentGroup: () => {},
};

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  // Synchronous warm-start. We don't yet know the userId at this point
  // (UserConfigProvider hasn't initialized), so we start with empty groups
  // and pull from cache as soon as the user_id arrives via syncGroup.
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroupState] = useState<Group | undefined>(
    () => getCachedCurrentGroup() ?? undefined,
  );
  const [hasEverLoaded, setHasEverLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const setCurrentGroup = useCallback((g?: Group) => {
    setCurrentGroupState(g);
    setCachedCurrentGroup(g ?? null);
  }, []);

  const handleState = useCallback((res: Group[]) => {
    setGroups(res);
    setHasEverLoaded(true);
  }, []);

  const handleSetGroups = useCallback(
    (newGroups: Group[], userId?: number) => {
      startTransition(() => {
        handleState(newGroups);
      });
      if (userId) {
        setCachedGroups(userId, newGroups);
      }
    },
    [handleState],
  );

  const syncGroup = useCallback(
    async (user_id: number) => {
      setIsFetching(true);

      // Synchronous localStorage hit (instant)
      const lsGroups = getCachedGroups(user_id);
      if (lsGroups && lsGroups.length > 0) {
        startTransition(() => {
          handleState(lsGroups);
        });
      }

      // Source of truth
      try {
        const res = await getGroups(user_id);
        if (res.status && res.data) {
          startTransition(() => {
            handleState(res.data);
          });
          setCachedGroups(user_id, res.data);
        }
      } catch (error) {
        console.error('[GroupProvider] Error fetching from API:', error);
      } finally {
        setIsFetching(false);
        setHasEverLoaded(true);
      }
    },
    [handleState],
  );

  const ctxVal = useMemo(
    () => ({
      loading: !hasEverLoaded,
      isFetching,
      hasEverLoaded,
      groups,
      currentGroup,
      setCurrentGroup,
      syncGroup,
      setter: handleSetGroups,
    }),
    [
      hasEverLoaded,
      isFetching,
      currentGroup,
      groups,
      setCurrentGroup,
      syncGroup,
      handleSetGroups,
    ],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useGroupCtx = () => useContext(Ctx);
