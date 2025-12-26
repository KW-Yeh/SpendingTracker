'use client';

import { Modal } from '@/components/Modal';
import { Loading } from '@/components/icons/Loading';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useState, useCallback, useMemo } from 'react';

const MONTHS = [
  { value: 1, label: '一月' },
  { value: 2, label: '二月' },
  { value: 3, label: '三月' },
  { value: 4, label: '四月' },
  { value: 5, label: '五月' },
  { value: 6, label: '六月' },
  { value: 7, label: '七月' },
  { value: 8, label: '八月' },
  { value: 9, label: '九月' },
  { value: 10, label: '十月' },
  { value: 11, label: '十一月' },
  { value: 12, label: '十二月' },
];

export const MonthlyBudgetBlocks = () => {
  const { budget, updateBudget } = useBudgetCtx();
  const { currentGroup } = useGroupCtx();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  // Calculate total budget for each month
  const monthlyTotals = useMemo(() => {
    const totals: { [key: number]: number } = {};
    MONTHS.forEach((month) => {
      totals[month.value] = 0;
    });

    if (budget?.monthly_items) {
      budget.monthly_items.forEach((item) => {
        Object.entries(item.months || {}).forEach(([monthStr, amount]) => {
          const monthNum = parseInt(monthStr);
          totals[monthNum] = (totals[monthNum] || 0) + amount;
        });
      });
    }

    return totals;
  }, [budget?.monthly_items]);

  // Get items for a specific month
  const getMonthItems = useCallback(
    (month: number) => {
      if (!budget?.monthly_items) return [];

      return budget.monthly_items
        .map((item, index) => ({
          index,
          name: item.name,
          amount: item.months?.[month.toString()] || 0,
        }))
        .filter((item) => item.amount > 0);
    },
    [budget?.monthly_items],
  );

  const handleOpenAddModal = (month: number) => {
    setSelectedMonth(month);
    setItemName('');
    setItemAmount(0);
    setModalOpen(true);
  };

  const handleSaveItem = useCallback(async () => {
    if (!currentGroup?.account_id || !itemName.trim() || selectedMonth === null) {
      alert('請填寫項目名稱與金額');
      return;
    }

    setSaving(true);
    try {
      // Check if item with same name exists
      const existingItemIndex = budget?.monthly_items.findIndex(
        (item) => item.name === itemName,
      );

      let newItems: MonthlyBudgetItem[];

      if (existingItemIndex !== undefined && existingItemIndex >= 0) {
        // Update existing item
        newItems = [...(budget?.monthly_items || [])];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          months: {
            ...newItems[existingItemIndex].months,
            [selectedMonth.toString()]: itemAmount,
          },
        };
      } else {
        // Create new item
        const newItem: MonthlyBudgetItem = {
          name: itemName,
          months: {
            [selectedMonth.toString()]: itemAmount,
          },
        };
        newItems = [...(budget?.monthly_items || []), newItem];
      }

      await updateBudget({
        budget_id: budget?.budget_id,
        account_id: currentGroup.account_id,
        annual_budget: budget?.annual_budget || 0,
        monthly_items: newItems,
      });

      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('儲存失敗，請稍後再試');
    } finally {
      setSaving(false);
    }
  }, [currentGroup, budget, itemName, itemAmount, selectedMonth, updateBudget]);

  const handleDeleteItem = useCallback(
    async (month: number, itemIndex: number) => {
      if (!currentGroup?.account_id) return;

      const confirmDelete = window.confirm('確定要刪除此項目嗎？');
      if (!confirmDelete) return;

      try {
        const newItems = [...(budget?.monthly_items || [])];
        const item = newItems[itemIndex];

        // Remove the month amount from the item
        const newMonths = { ...item.months };
        delete newMonths[month.toString()];

        // If item has no more months, remove the entire item
        if (Object.keys(newMonths).length === 0) {
          newItems.splice(itemIndex, 1);
        } else {
          newItems[itemIndex] = {
            ...item,
            months: newMonths,
          };
        }

        await updateBudget({
          budget_id: budget?.budget_id,
          account_id: currentGroup.account_id,
          annual_budget: budget?.annual_budget || 0,
          monthly_items: newItems,
        });
      } catch (error) {
        console.error(error);
        alert('刪除失敗，請稍後再試');
      }
    },
    [currentGroup, budget, updateBudget],
  );

  const currentMonth = new Date().getMonth() + 1;

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:max-w-250">
        {MONTHS.map((month) => {
          const monthItems = getMonthItems(month.value);
          const monthTotal = monthlyTotals[month.value];
          const isCurrentMonth = month.value === currentMonth;

          return (
            <div
              key={month.value}
              className={`bg-background rounded-xl p-4 shadow ${
                isCurrentMonth ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  {month.label}
                  {isCurrentMonth && (
                    <span className="text-primary-500 ml-2 text-xs">(本月)</span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(month.value)}
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  + 新增
                </button>
              </div>

              <p className="mt-2 text-2xl font-bold">
                {normalizeNumber(monthTotal)} 元
              </p>

              <div className="mt-3 space-y-2">
                {monthItems.length > 0 ? (
                  monthItems.map((item) => (
                    <div
                      key={`${month.value}-${item.index}`}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {normalizeNumber(item.amount)} 元
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(month.value, item.index)}
                        className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 active:bg-red-50"
                      >
                        <DeleteIcon className="size-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-xs text-gray-400">
                    尚未新增項目
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && selectedMonth !== null && (
        <Modal
          defaultOpen={true}
          onClose={() => setModalOpen(false)}
          className="flex w-full flex-col self-end sm:max-w-96 sm:self-center sm:rounded-xl"
          title={`新增 ${MONTHS[selectedMonth - 1].label} 預算項目`}
        >
          <div className="flex w-full flex-col gap-4">
            <fieldset>
              <legend className="mb-2">項目名稱</legend>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="例如：房租、水電費"
              />
            </fieldset>

            <fieldset>
              <legend className="mb-2">預算金額</legend>
              <input
                type="number"
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1"
                value={itemAmount || ''}
                onChange={(e) => setItemAmount(Number(e.target.value))}
                placeholder="5000"
              />
            </fieldset>

            <div className="flex w-full justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="rounded-lg border border-solid border-gray-300 px-4 py-2 text-gray-500"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={saving}
                className="bg-text text-background flex items-center justify-center rounded-lg px-6 py-2 font-bold transition-colors hover:bg-gray-800 active:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {saving ? <Loading className="size-5 animate-spin" /> : '新增'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
