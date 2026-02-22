'use client';

import { useIDB } from '@/hooks/useIDB';
import { useGroupCtx } from '@/context/GroupProvider';
import {
  getBudget as getBudgetAPI,
  putBudget as putBudgetAPI,
  deleteBudget as deleteBudgetAPI,
} from '@/services/budgetServices';
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
  isInitialLoad: true,
  budget: null,
  syncBudget: () => {},
  updateBudget: async () => {},
  removeBudget: async () => {},
};

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [budget, setBudget] = useState<Budget | null>(null);
  const { db, getBudgetData, setBudgetData } = useIDB();
  const { currentGroup } = useGroupCtx();

  const handleState = useCallback((data: Budget | null) => {
    setBudget(data);
    setLoading(false);
    setIsInitialLoad(false);
  }, []);

  // Cloud-first: fetch from API, show IDB cache first
  const syncBudget = useCallback(
    async (accountId: number) => {
      setLoading(true);

      // Show IDB cache first for fast render
      if (db) {
        try {
          const cachedData = await getBudgetData(db, accountId);
          if (cachedData) {
            startTransition(() => {
              handleState(cachedData);
            });
          }
        } catch {
          // IDB cache miss is fine
        }
      }

      // Fetch from API (source of truth)
      try {
        const res = await getBudgetAPI(accountId);
        if (res.status) {
          handleState(res.data);
          // Update IDB cache
          if (db && res.data) {
            await setBudgetData(db, accountId, res.data);
          }
        }
      } catch (error) {
        console.error('[BudgetProvider] Error fetching from API:', error);
      }
    },
    [db, getBudgetData, setBudgetData, handleState],
  );

  // Cloud-first: write to API, then update local state + IDB cache
  const updateBudget = useCallback(
    async (data: {
      budget_id?: number;
      account_id: number;
      annual_budget: number;
      monthly_items: MonthlyBudgetItem[];
    }) => {
      setLoading(true);

      try {
        const res = await putBudgetAPI(data);
        if (res.status && res.data) {
          handleState(res.data);
          // Update IDB cache
          if (db) {
            await setBudgetData(db, data.account_id, res.data);
          }
        }
      } catch (error) {
        console.error('[BudgetProvider] Error updating budget in API:', error);
        setLoading(false);
      }
    },
    [db, setBudgetData, handleState],
  );

  // Cloud-first: delete from API, then clear local state
  const removeBudget = useCallback(
    async (accountId: number) => {
      setLoading(true);

      try {
        await deleteBudgetAPI(accountId);
        handleState(null);
      } catch (error) {
        console.error('[BudgetProvider] Error deleting budget from API:', error);
        setLoading(false);
      }
    },
    [handleState],
  );

  // Auto-sync budget when current group or db changes
  useEffect(() => {
    if (currentGroup?.account_id) {
      syncBudget(currentGroup.account_id);
    }
  }, [currentGroup?.account_id, syncBudget]);

  const ctxVal = useMemo(
    () => ({
      loading,
      isInitialLoad,
      budget,
      syncBudget,
      updateBudget,
      removeBudget,
    }),
    [loading, isInitialLoad, budget, syncBudget, updateBudget, removeBudget],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useBudgetCtx = () => useContext(Ctx);
