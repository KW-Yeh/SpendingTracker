'use client';
import { BudgetCard } from '@/app/budget/BudgetCard';
import { EditBudgetModal } from '@/app/budget/EditBudgetModal';
import { useBudget } from '@/hooks/useBudget';
import { IoMdAdd } from 'react-icons/io';

export const BudgetList = () => {
  const { budgets, loading, openModal, handleSave, setOpenModal } = useBudget();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="bg-background w-fit rounded-lg text-sm sm:text-base">
        <button
          type="button"
          className="text-background flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 transition-all duration-200 hover:opacity-70 sm:px-6 sm:py-3"
          onClick={() => setOpenModal(true)}
        >
          <IoMdAdd className="size-5" />
          <span>新增預算項目</span>
        </button>
      </div>

      <div className="flex w-full flex-row flex-wrap justify-center gap-4 py-5">
        {budgets.map((budget) => (
          <BudgetCard key={budget.name} budget={budget} />
        ))}
      </div>

      {openModal && (
        <EditBudgetModal
          onSave={handleSave}
          budget={null}
          onClose={() => setOpenModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};
