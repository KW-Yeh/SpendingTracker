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
import { INCOME_TYPE_MAP, OUTCOME_TYPE_MAP } from '@/utils/constants';
import { useState, useCallback, useMemo } from 'react';

const ALL_CATEGORIES = [...INCOME_TYPE_MAP, ...OUTCOME_TYPE_MAP];

const MONTHS = [
  { value: '1', label: '一月' },
  { value: '2', label: '二月' },
  { value: '3', label: '三月' },
  { value: '4', label: '四月' },
  { value: '5', label: '五月' },
  { value: '6', label: '六月' },
  { value: '7', label: '七月' },
  { value: '8', label: '八月' },
  { value: '9', label: '九月' },
  { value: '10', label: '十月' },
  { value: '11', label: '十一月' },
  { value: '12', label: '十二月' },
];

export const MonthlyItemsList = () => {
  const { budget, updateBudget } = useBudgetCtx();
  const { currentGroup } = useGroupCtx();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [itemCategory, setItemCategory] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [monthlyAmounts, setMonthlyAmounts] = useState<{
    [key: string]: number;
  }>({});
  const [saving, setSaving] = useState(false);

  const selectedCategoryLabel = useMemo(
    () => ALL_CATEGORIES.find((cat) => cat.value === itemCategory)?.label || '',
    [itemCategory],
  );

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setItemCategory('');
    setItemDescription('');
    setMonthlyAmounts({});
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number, item: MonthlyBudgetItem) => {
    setEditingIndex(index);
    setItemCategory(item.category);
    setItemDescription(item.description);
    setMonthlyAmounts(item.months || {});
    setModalOpen(true);
  };

  const handleSaveItem = useCallback(async () => {
    if (!currentGroup?.account_id || !itemCategory.trim()) {
      alert('請填寫類別');
      return;
    }

    setSaving(true);
    try {
      // Use category label as description if description is empty
      const finalDescription = itemDescription.trim() || selectedCategoryLabel;

      const newItem: MonthlyBudgetItem = {
        category: itemCategory,
        description: finalDescription,
        months: monthlyAmounts,
      };

      let newItems: MonthlyBudgetItem[];
      if (editingIndex !== null) {
        // Edit existing item
        newItems = [...(budget?.monthly_items || [])];
        newItems[editingIndex] = newItem;
      } else {
        // Add new item
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
  }, [
    currentGroup,
    budget,
    itemCategory,
    itemDescription,
    monthlyAmounts,
    editingIndex,
    selectedCategoryLabel,
    updateBudget,
  ]);

  const handleDeleteItem = useCallback(
    async (index: number) => {
      if (!currentGroup?.account_id) return;

      const confirmDelete = window.confirm('確定要刪除此項目嗎？');
      if (!confirmDelete) return;

      const newItems =
        budget?.monthly_items.filter((_, i) => i !== index) || [];

      try {
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

  const handleMonthAmountChange = (month: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setMonthlyAmounts((prev) => ({
      ...prev,
      [month]: numValue,
    }));
  };

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="bg-background w-full rounded-xl p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">月度預算項目</h2>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-text text-background rounded-lg px-4 py-2 text-sm font-bold transition-colors hover:bg-gray-800 active:bg-gray-800"
        >
          + 新增項目
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {budget?.monthly_items && budget.monthly_items.length > 0 ? (
          budget.monthly_items.map((item, index) => {
            const currentMonthAmount =
              item.months?.[currentMonth.toString()] || 0;
            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-solid border-gray-200 p-3"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    <span className="mr-2 text-xl">{item.category}</span>
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-300">
                    本月: {normalizeNumber(currentMonthAmount)} 元
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(index, item)}
                    className="rounded p-2 text-blue-500 transition-colors hover:bg-blue-50 active:bg-blue-50"
                  >
                    <EditIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="rounded p-2 text-red-500 transition-colors hover:bg-red-50 active:bg-red-50"
                  >
                    <DeleteIcon className="size-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-8 text-center text-gray-300">尚未新增任何項目</p>
        )}
      </div>

      {modalOpen && (
        <Modal
          defaultOpen={true}
          onClose={() => setModalOpen(false)}
          className="flex w-full flex-col self-end sm:max-w-2xl sm:self-center sm:rounded-xl"
          title={
            editingIndex !== null ? '編輯月度預算項目' : '新增月度預算項目'
          }
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
                    <span className="text-gray-300">請選擇類別</span>
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
              <legend className="mb-2">
                描述（選填，未填寫則使用類別名稱）
              </legend>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder={`例如：房租、午餐、薪水（預設：${selectedCategoryLabel}）`}
              />
            </fieldset>

            <fieldset>
              <legend className="mb-2">各月份預算金額</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {MONTHS.map((month) => (
                  <div key={month.value} className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-600">
                      {month.label}
                    </label>
                    <input
                      type="number"
                      className="h-9 w-full rounded-md border border-solid border-gray-300 px-2 py-1 text-sm"
                      value={monthlyAmounts[month.value] || ''}
                      onChange={(e) =>
                        handleMonthAmountChange(month.value, e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="flex w-full justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="rounded-lg border border-solid border-gray-300 px-4 py-2 text-gray-300"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={saving}
                className="bg-text text-background flex items-center justify-center rounded-lg px-6 py-2 font-bold transition-colors hover:bg-gray-800 active:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {saving ? (
                  <Loading className="size-5 animate-spin" />
                ) : editingIndex !== null ? (
                  '更新'
                ) : (
                  '新增'
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
