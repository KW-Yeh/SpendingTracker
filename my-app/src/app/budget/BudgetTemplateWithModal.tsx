'use client';

import { BudgetModalProvider } from './BudgetModalContext';
import { ItemBudgetTemplate } from './ItemBudgetTemplate';
import { SimpleBudgetForm } from './SimpleBudgetForm';

export const BudgetTemplateWithModal = () => {
  return (
    <BudgetModalProvider>
      <ItemBudgetTemplate />
      <BudgetFormModal />
    </BudgetModalProvider>
  );
};

// Modal component that uses the context
import { useBudgetModal } from './BudgetModalContext';
import { useUserConfigCtx } from '@/context/UserConfigProvider';

const BudgetFormModal = () => {
  const { isModalOpen, currentItem, closeModal } = useBudgetModal();
  const { config: userData, setter: updateUserConfig } = useUserConfigCtx();

  const handleSaveItem = (item: BudgetItem) => {
    if (!userData) return;

    let updatedBudget: BudgetItem[];

    if (userData.budget) {
      if (currentItem) {
        // Update existing item
        updatedBudget = userData.budget.map((budgetItem) =>
          budgetItem.id === item.id ? item : budgetItem,
        );
      } else {
        // Add new item
        updatedBudget = [...userData.budget, item];
      }
    } else {
      // First budget item
      updatedBudget = [item];
    }

    // Update user configuration
    updateUserConfig({
      ...userData,
      budget: updatedBudget,
    }).then();

    closeModal();
  };

  return (
    <SimpleBudgetForm
      isOpen={isModalOpen}
      onClose={closeModal}
      onSave={handleSaveItem}
      editItem={currentItem}
    />
  );
};
