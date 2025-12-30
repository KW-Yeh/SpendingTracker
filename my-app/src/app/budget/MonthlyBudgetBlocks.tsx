'use client';

import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Loading } from '@/components/icons/Loading';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { SpendingType, INCOME_TYPE_MAP, OUTCOME_TYPE_MAP } from '@/utils/constants';
import { useState, useCallback, useMemo } from 'react';

const ALL_CATEGORIES = [...INCOME_TYPE_MAP, ...OUTCOME_TYPE_MAP];

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

interface Props {
  yearlySpending: SpendingRecord[];
}

export const MonthlyBudgetBlocks = ({ yearlySpending }: Props) => {
  const { budget, updateBudget } = useBudgetCtx();
  const { currentGroup } = useGroupCtx();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [itemCategory, setItemCategory] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const selectedCategoryLabel = useMemo(
    () => ALL_CATEGORIES.find((cat) => cat.value === itemCategory)?.label || '',
    [itemCategory],
  );

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

  // Calculate actual spending for each month
  const monthlySpending = useMemo(() => {
    const spending: { [key: number]: number } = {};
    MONTHS.forEach((month) => {
      spending[month.value] = 0;
    });

    yearlySpending.forEach((record) => {
      if (record.type === SpendingType.Outcome) {
        const recordDate = new Date(record.date);
        const month = recordDate.getMonth() + 1;
        const amount = Number(record.amount);
        spending[month] = (spending[month] || 0) + amount;
      }
    });

    return spending;
  }, [yearlySpending]);

  // Get items for a specific month
  const getMonthItems = useCallback(
    (month: number) => {
      if (!budget?.monthly_items) return [];

      return budget.monthly_items
        .map((item, index) => ({
          index,
          category: item.category,
          description: item.description,
          amount: item.months?.[month.toString()] || 0,
        }))
        .filter((item) => item.amount > 0);
    },
    [budget?.monthly_items],
  );

  const handleOpenAddModal = (month: number) => {
    setSelectedMonth(month);
    setEditingIndex(null);
    setItemCategory('');
    setItemDescription('');
    setItemAmount(0);
    setModalOpen(true);
  };

  const handleOpenEditModal = (month: number, itemIndex: number) => {
    const item = budget?.monthly_items?.[itemIndex];
    if (!item) return;

    setSelectedMonth(month);
    setEditingIndex(itemIndex);
    setItemCategory(item.category);
    setItemDescription(item.description);
    setItemAmount(item.months?.[month.toString()] || 0);
    setModalOpen(true);
  };

  const handleSaveItem = useCallback(async () => {
    if (!currentGroup?.account_id || !itemCategory.trim() || selectedMonth === null) {
      alert('請填寫類別與金額');
      return;
    }

    setSaving(true);
    try {
      // Use category label as description if description is empty
      const finalDescription = itemDescription.trim() || selectedCategoryLabel;

      let newItems: MonthlyBudgetItem[];

      if (editingIndex !== null) {
        // Editing existing item
        newItems = [...(budget?.monthly_items || [])];
        newItems[editingIndex] = {
          ...newItems[editingIndex],
          category: itemCategory,
          description: finalDescription,
          months: {
            ...newItems[editingIndex].months,
            [selectedMonth.toString()]: itemAmount,
          },
        };
      } else {
        // Adding new item - check if item with same category + description exists
        const existingItemIndex = budget?.monthly_items?.findIndex(
          (item) => item.category === itemCategory && item.description === finalDescription,
        );

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
            category: itemCategory,
            description: finalDescription,
            months: {
              [selectedMonth.toString()]: itemAmount,
            },
          };
          newItems = [...(budget?.monthly_items || []), newItem];
        }
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
  }, [currentGroup, budget, itemCategory, itemDescription, itemAmount, selectedMonth, selectedCategoryLabel, editingIndex, updateBudget]);

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
          const monthSpent = monthlySpending[month.value];
          const usagePercentage = monthTotal > 0 ? (monthSpent / monthTotal) * 100 : 0;
          const isCurrentMonth = month.value === currentMonth;
          const isOverBudget = monthSpent > monthTotal;

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

              <div className="mt-2">
                <p className="text-2xl font-bold">
                  {normalizeNumber(monthTotal)} 元
                </p>
                <p className="text-sm text-gray-500">
                  已使用 {normalizeNumber(monthSpent)} 元
                  {monthTotal > 0 && (
                    <span className={`ml-1 font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      ({usagePercentage.toFixed(1)}%)
                    </span>
                  )}
                </p>
              </div>

              {/* Progress Bar */}
              {monthTotal > 0 && (
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${
                        isOverBudget ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-3 space-y-2">
                {monthItems.length > 0 ? (
                  monthItems.map((item) => (
                    <div
                      key={`${month.value}-${item.index}`}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.category} {item.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {normalizeNumber(item.amount)} 元
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(month.value, item.index)}
                          className="rounded p-1 text-blue-500 transition-colors hover:bg-blue-50 active:bg-blue-50"
                        >
                          <EditIcon className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(month.value, item.index)}
                          className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 active:bg-red-50"
                        >
                          <DeleteIcon className="size-4" />
                        </button>
                      </div>
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
          title={editingIndex !== null ? `編輯 ${MONTHS[selectedMonth - 1].label} 預算項目` : `新增 ${MONTHS[selectedMonth - 1].label} 預算項目`}
        >
          <div className="flex w-full flex-col gap-4">
            <fieldset>
              <legend className="mb-2">類別</legend>
              <Select
                name="category"
                value={itemCategory}
                label={
                  itemCategory ? (
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(itemCategory)}
                      <span>{selectedCategoryLabel}</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">請選擇類別</span>
                  )
                }
                onChange={setItemCategory}
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1 transition-colors hover:border-gray-500 active:border-gray-500"
              >
                {ALL_CATEGORIES.map((category) => (
                  <Select.Item key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(category.value)}
                      <span>{category.label}</span>
                    </span>
                  </Select.Item>
                ))}
              </Select>
            </fieldset>

            <fieldset>
              <legend className="mb-2">描述（選填，未填寫則使用類別名稱）</legend>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder={`例如：房租、午餐、薪水（預設：${selectedCategoryLabel}）`}
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
                {saving ? <Loading className="size-5 animate-spin" /> : editingIndex !== null ? '更新' : '新增'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
