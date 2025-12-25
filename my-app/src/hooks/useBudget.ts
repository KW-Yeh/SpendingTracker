'use client';

import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useCallback, useState } from 'react';

export const useBudget = (budgetName?: string) => {
  const { config: userData, budgetData, setBudgetData } = useUserConfigCtx();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = useCallback(
    (item: BudgetItem, isNew: boolean) => {
      if (!userData) return;
      setLoading(true);
      const newBudget = [...(budgetData.budget ?? [])];
      if (isNew) {
        newBudget.push(item);
      } else {
        const index = newBudget.findIndex(
          (budgetItem) => budgetItem.name === item.name,
        );
        if (index !== -1) {
          newBudget[index] = item;
        }
      }
      setBudgetData({
        budget: newBudget,
      }).then(() => {
        setLoading(false);
        setOpenModal(false);
      });
    },
    [setBudgetData, budgetData, userData],
  );

  const handleDelete = useCallback(() => {
    if (!userData) return;
    setBudgetData({
      budget: budgetData.budget?.filter(
        (budgetItem) => budgetItem.name !== budgetName,
      ),
    });
  }, [budgetName, setBudgetData, budgetData, userData]);

  return {
    budgets: budgetData.budget ?? [],
    openModal,
    setOpenModal,
    loading,
    handleSave,
    handleDelete,
  };
};
