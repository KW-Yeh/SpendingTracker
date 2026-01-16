'use client';

import { getBudget, putBudget, deleteBudget } from '@/services/budgetServices';
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
    // Once we receive data (even null), initial load is complete
    setIsInitialLoad(false);
  }, []);

  // Stale-While-Revalidate strategy for budget
  const syncBudget = useCallback(
    async (accountId: number) => {
      if (!db) {
        // Fallback to direct API call
        setLoading(true);
        getBudget(accountId)
          .then((res) => {
            if (res.status) {
              handleState(res.data);
            } else {
              handleState(null);
            }
          })
          .catch((err) => {
            console.error(err);
            handleState(null);
          });
        return;
      }

      // Try cache first
      try {
        const cachedData = await getBudgetData(db, accountId);
        if (cachedData) {
          console.log('[BudgetProvider] Using cached budget data');
          startTransition(() => {
            setBudget(cachedData);
            setLoading(false);
          });
        } else {
          setLoading(true);
        }
      } catch (error) {
        console.error('[BudgetProvider] Error reading cache:', error);
        setLoading(true);
      }

      // Revalidate in background
      getBudget(accountId)
        .then((res) => {
          if (res.status) {
            startTransition(() => {
              handleState(res.data);
            });
            if (res.data) {
              setBudgetData(db, accountId, res.data).catch(console.error);
            }
          } else {
            handleState(null);
          }
        })
        .catch((err) => {
          console.error(err);
          handleState(null);
        });
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
      setLoading(true);
      const res = await putBudget(data);
      if (res.status && res.data) {
        handleState(res.data);
        // Update cache
        if (db) {
          setBudgetData(db, data.account_id, res.data).catch(console.error);
        }
      } else {
        setLoading(false);
        throw new Error(res.message);
      }
    },
    [db, setBudgetData, handleState],
  );

  const removeBudget = useCallback(
    async (accountId: number) => {
      setLoading(true);
      const res = await deleteBudget(accountId);
      if (res.status) {
        handleState(null);
      } else {
        setLoading(false);
        throw new Error(res.message);
      }
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
