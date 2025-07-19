'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BudgetModalContextType {
  isModalOpen: boolean;
  currentItem: BudgetItem | null;
  openModal: (item?: BudgetItem) => void;
  closeModal: () => void;
}

const BudgetModalContext = createContext<BudgetModalContextType>({
  isModalOpen: false,
  currentItem: null,
  openModal: () => {},
  closeModal: () => {},
});

export const useBudgetModal = () => useContext(BudgetModalContext);

export const BudgetModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<BudgetItem | null>(null);

  const openModal = (item?: BudgetItem) => {
    console.log('Opening modal with item:', item);
    setCurrentItem(item || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  return (
    <BudgetModalContext.Provider
      value={{
        isModalOpen,
        currentItem,
        openModal,
        closeModal,
      }}
    >
      {children}
    </BudgetModalContext.Provider>
  );
};
