'use client';

import { useIDBCtx } from '@/context/IDBProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import {
  getBudget as getBudgetAPI,
  putBudget as putBudgetAPI,
  deleteBudget as deleteBudgetAPI,
} from '@/services/budgetServices';
import {
  getCachedBudget,
  setCachedBudget,
} from '@/utils/localCache';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from 'react';

const INIT_CTX_VAL: {
  loading: boolean;
  isFetching: boolean;
  hasEverLoaded: boolean;
  isInitialLoad: boolean;
  budget: Budget | null;
  syncBudget: (accountId: number) => void;
  updateBudget: (data: {
    budget_id?: number;
    account_id: number;
    annual_budget: number;
    monthly_items: MonthlyBudgetItem[];
  }) => Promise<void>;
  removeBudget: (accountId: number) => Promise<void>;
} = {
  loading: true,
  isFetching: false,
  hasEverLoaded: false,
  isInitialLoad: true,
  budget: null,
  syncBudget: () => {},
  updateBudget: async () => {},
  removeBudget: async () => {},
};

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const { currentGroup } = useGroupCtx();
  const { db, getBudgetData, setBudgetData, deleteBudgetData } = useIDBCtx();

  // Synchronous warm-start: if we already know the current group, pull
  // its cached budget from localStorage now.
  const [budget, setBudget] = useState<Budget | null>(() => {
    if (!currentGroup?.account_id) return null;
    return getCachedBudget(currentGroup.account_id);
  });
  const [hasEverLoaded, setHasEverLoaded] = useState<boolean>(() => {
    if (!currentGroup?.account_id) return false;
    return getCachedBudget(currentGroup.account_id) !== null;
  });
  const [isFetching, setIsFetching] = useState(false);

  const handleState = useCallback((data: Budget | null, accountId?: number) => {
    setBudget(data);
    setHasEverLoaded(true);
    if (accountId) setCachedBudget(accountId, data);
  }, []);

  const syncBudget = useCallback(
    async (accountId: number) => {
      setIsFetching(true);

      // Synchronous LS hit
      const ls = getCachedBudget(accountId);
      if (ls) {
        startTransition(() => handleState(ls, accountId));
      }

      // Async IDB hit
      if (db) {
        try {
          const cachedData = await getBudgetData(db, accountId);
          if (cachedData) {
            startTransition(() => handleState(cachedData, accountId));
          }
        } catch {
          /* miss is fine */
        }
      }

      // Source of truth
      try {
        const res = await getBudgetAPI(accountId);
        if (res.status) {
          handleState(res.data, accountId);
          if (db && res.data) {
            await setBudgetData(db, accountId, res.data);
          }
        }
      } catch (error) {
        console.error('[BudgetProvider] Error fetching from API:', error);
      } finally {
        setIsFetching(false);
        setHasEverLoaded(true);
      }
    },
    [db, getBudgetData, setBudgetData, handleState],
  );

  const updateBudget = useCallback(
    async (data: {
      budget_id?: number;
      account_id: number;
      annual_budget: number;
      monthly_items: MonthlyBudgetItem[];
    }) => {
      setIsFetching(true);
      try {
        const res = await putBudgetAPI(data);
        if (res.status && res.data) {
          handleState(res.data, data.account_id);
          if (db) await setBudgetData(db, data.account_id, res.data);
        }
      } catch (error) {
        console.error('[BudgetProvider] Error updating budget in API:', error);
      } finally {
        setIsFetching(false);
      }
    },
    [db, setBudgetData, handleState],
  );

  const removeBudget = useCallback(
    async (accountId: number) => {
      setIsFetching(true);
      try {
        await deleteBudgetAPI(accountId);
        handleState(null, accountId);
        if (db) await deleteBudgetData(db, accountId);
      } catch (error) {
        console.error('[BudgetProvider] Error deleting budget from API:', error);
      } finally {
        setIsFetching(false);
      }
    },
    [db, deleteBudgetData, handleState],
  );

  // When current group changes, hot-swap to its cached budget synchronously
  // (before the API call resolves).
  useEffect(() => {
    if (!currentGroup?.account_id) return;
    const ls = getCachedBudget(currentGroup.account_id);
    if (ls) {
      startTransition(() => handleState(ls, currentGroup.account_id!));
    }
    syncBudget(currentGroup.account_id);
  }, [currentGroup?.account_id, syncBudget, handleState]);

  const ctxVal = useMemo(
    () => ({
      loading: !hasEverLoaded,
      isFetching,
      hasEverLoaded,
      isInitialLoad: !hasEverLoaded,
      budget,
      syncBudget,
      updateBudget,
      removeBudget,
    }),
    [hasEverLoaded, isFetching, budget, syncBudget, updateBudget, removeBudget],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useBudgetCtx = () => useContext(Ctx);
