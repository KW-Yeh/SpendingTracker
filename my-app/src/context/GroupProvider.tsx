'use client';

import { useMockMode } from '@/hooks/useMockMode';
import { getGroups } from '@/services/groupServices';
import { MOCK_GROUP } from '@/utils/mockData';
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

const noop = () => {};

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const mockMode = useMockMode();
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

  // The cached currentGroup is a full snapshot, so swap it for the matching
  // entry from authoritative data. If the group no longer exists (deleted, or
  // the user was removed), clear it so usePrepareData picks a default.
  const reconcileCurrentGroup = useCallback((freshGroups: Group[]) => {
    setCurrentGroupState((prev) => {
      if (!prev) return prev;
      const fresh = freshGroups.find((g) => g.account_id === prev.account_id);
      setCachedCurrentGroup(fresh ?? null);
      return fresh;
    });
  }, []);

  const handleSetGroups = useCallback(
    (newGroups: Group[], userId?: number) => {
      startTransition(() => {
        handleState(newGroups);
        reconcileCurrentGroup(newGroups);
      });
      if (userId) {
        setCachedGroups(userId, newGroups);
      }
    },
    [handleState, reconcileCurrentGroup],
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

      // Source of truth: remote overrides the warm-start and refreshes the cache
      try {
        const res = await getGroups(user_id);
        if (res.status && res.data) {
          startTransition(() => {
            handleState(res.data);
            reconcileCurrentGroup(res.data);
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
    [handleState, reconcileCurrentGroup],
  );

  const ctxVal = useMemo(
    () =>
      mockMode
        ? {
            loading: false,
            isFetching: false,
            hasEverLoaded: true,
            groups: [MOCK_GROUP],
            currentGroup: MOCK_GROUP,
            // Mutators are inert in mock mode so nothing reaches the cache.
            setCurrentGroup: noop,
            syncGroup: noop,
            setter: noop,
          }
        : {
            loading: !hasEverLoaded,
            isFetching,
            hasEverLoaded,
            groups,
            currentGroup,
            setCurrentGroup,
            syncGroup,
            setter: handleSetGroups,
          },
    [
      mockMode,
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
