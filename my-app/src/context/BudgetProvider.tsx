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

  const handleState = useCallback((data: Budget | null) => {
    setBudget(data);
    setLoading(false);
    setIsInitialLoad(false);
  }, []);

  // IDB-only: read budget from IDB
  const syncBudget = useCallback(
    async (accountId: number) => {
      if (!db) {
        setLoading(true);
        return;
      }

      try {
        const cachedData = await getBudgetData(db, accountId);
        if (cachedData) {
          startTransition(() => {
            handleState(cachedData);
          });
        } else {
          handleState(null);
        }
      } catch (error) {
        console.error('[BudgetProvider] Error reading IDB:', error);
        handleState(null);
      }
    },
    [db, getBudgetData, handleState],
  );

  // IDB-only: write budget to IDB + update state
  const updateBudget = useCallback(
    async (data: {
      budget_id?: number;
      account_id: number;
      annual_budget: number;
      monthly_items: MonthlyBudgetItem[];
    }) => {
      setLoading(true);

      // Calculate monthly_budget locally
      const currentMonth = new Date().getMonth() + 1;
      const monthly_budget = data.monthly_items.reduce((sum, item) => {
        const monthAmount = item.months?.[currentMonth.toString()] || 0;
        return sum + monthAmount;
      }, 0);

      const budgetData: Budget = {
        budget_id: data.budget_id || Date.now(),
        account_id: data.account_id,
        annual_budget: data.annual_budget,
        monthly_budget,
        monthly_items: data.monthly_items,
        updated_at: new Date().toISOString(),
      };

      if (db) {
        await setBudgetData(db, data.account_id, budgetData);
      }
      handleState(budgetData);
    },
    [db, setBudgetData, handleState],
  );

  // IDB-only: remove budget from state (IDB record stays until next sync overwrites)
  const removeBudget = useCallback(
    async (accountId: number) => {
      setLoading(true);
      // Set budget to null locally; the cloud delete will happen on next sync push
      handleState(null);
    },
    [handleState],
  );

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
