'use client';
import { EditBudgetModal } from '@/app/budget/EditBudgetModal';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { CATEGORY_WORDING_MAP } from '@/utils/constants';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useCallback, useState } from 'react';

export const BudgetCard = ({ budget }: { budget: BudgetItem }) => {
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
      });
    },
    [setter, syncUser, userData],
  );

  const handleDelete = useCallback(() => {
    if (!userData) return;
    setter({
      ...userData,
      budget: userData?.budget?.filter(
        (budgetItem) => budgetItem.name !== budget.name,
      ),
    }).then(() => {
      syncUser();
    });
  }, [budget.name, setter, syncUser, userData]);

  return (
    <div className="bg-background flex min-w-70 flex-col rounded-2xl border border-solid border-gray-300 p-4 shadow">
      <h2 className="flex items-center">
        <span className="flex items-center gap-1">
          {getCategoryIcon(budget.category)}
          {CATEGORY_WORDING_MAP[budget.category]}
        </span>
        <span className="ml-2 text-sm text-gray-600 before:mr-1 before:inline-block before:content-['-']">
          {budget.period}
        </span>
      </h2>
      <p className="my-1 text-lg font-semibold">
        {normalizeNumber(budget.amount)} 元
      </p>
      <div className="mt-2 flex w-full items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-background flex-1 rounded border border-solid px-2 py-1 transition-colors"
        >
          編輯
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded px-2 py-1 text-red-500 transition-colors hover:text-red-700"
        >
          刪除
        </button>
      </div>

      {openModal && (
        <EditBudgetModal
          onSave={handleSave}
          budget={budget}
          onClose={() => setOpenModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};
