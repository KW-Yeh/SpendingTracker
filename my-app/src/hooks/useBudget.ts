'use client';

import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useCallback, useState } from 'react';

export const useBudget = (budgetName?: string) => {
  const { config: userData, setter, syncUser } = useUserConfigCtx();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = useCallback(
    (item: BudgetItem, isNew: boolean) => {
      if (!userData) return;
      setLoading(true);
      const newBudget = [...(userData?.budget ?? [])];
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
      setter({
        ...userData,
        budget: newBudget,
      }).then(() => {
        syncUser();
        setLoading(false);
        setOpenModal(false);
      });
    },
    [setter, syncUser, userData],
  );

  const handleDelete = useCallback(() => {
    if (!userData) return;
    setter({
      ...userData,
      budget: userData?.budget?.filter(
        (budgetItem) => budgetItem.name !== budgetName,
      ),
    }).then(() => {
      syncUser();
    });
  }, [budgetName, setter, syncUser, userData]);

  return {
    budgets: userData?.budget ?? [],
    openModal,
    setOpenModal,
    loading,
    handleSave,
    handleDelete,
  };
};
