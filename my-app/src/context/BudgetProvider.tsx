'use client';

import { getBudget, putBudget, deleteBudget } from '@/services/budgetServices';
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
  budget: null,
  syncBudget: () => {},
  updateBudget: async () => {},
  removeBudget: async () => {},
};

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<Budget | null>(null);

  const handleState = useCallback((data: Budget | null) => {
    setBudget(data);
    setLoading(false);
  }, []);

  const syncBudget = useCallback(
    (accountId: number) => {
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
    },
    [handleState],
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
      } else {
        setLoading(false);
        throw new Error(res.message);
      }
    },
    [handleState],
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
      budget,
      syncBudget,
      updateBudget,
      removeBudget,
    }),
    [loading, budget, syncBudget, updateBudget, removeBudget],
  );

  return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext(INIT_CTX_VAL);
export const useBudgetCtx = () => useContext(Ctx);
