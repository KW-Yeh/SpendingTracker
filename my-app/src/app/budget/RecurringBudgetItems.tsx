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
import { useCallback, useMemo, useState } from 'react';

const ALL_CATEGORIES = [...INCOME_TYPE_MAP, ...OUTCOME_TYPE_MAP];
const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

// An item is "common / recurring" when all 12 months are present with the
// same positive amount. We use this to surface a shortcut for users who set
// the same value every month (e.g. rent, salary).
const getRecurringAmount = (item: MonthlyBudgetItem): number | null => {
  const months = item.months || {};
  const values = ALL_MONTHS.map((m) => months[m]);
  if (values.some((v) => !v || v <= 0)) return null;
  const first = values[0];
  return values.every((v) => v === first) ? first : null;
};

export const RecurringBudgetItems = () => {
  const { budget, updateBudget } = useBudgetCtx();
  const { currentGroup } = useGroupCtx();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [itemCategory, setItemCategory] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemAmount, setItemAmount] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const selectedCategoryLabel = useMemo(
    () => ALL_CATEGORIES.find((cat) => cat.value === itemCategory)?.label || '',
    [itemCategory],
  );

  const recurringItems = useMemo(() => {
    if (!budget?.monthly_items) return [];
    return budget.monthly_items
      .map((item, index) => {
        const amount = getRecurringAmount(item);
        return amount !== null
          ? {
              index,
              category: item.category,
              description: item.description,
              amount,
            }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [budget?.monthly_items]);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setItemCategory('');
    setItemDescription('');
    setItemAmount(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    const item = budget?.monthly_items?.[index];
    if (!item) return;
    const amount = getRecurringAmount(item) ?? 0;
    setEditingIndex(index);
    setItemCategory(item.category);
    setItemDescription(item.description);
    setItemAmount(amount);
    setModalOpen(true);
  };

  const handleSave = useCallback(async () => {
    if (!currentGroup?.account_id || !itemCategory.trim() || itemAmount <= 0) {
      alert('請填寫類別與大於 0 的金額');
      return;
    }

    setSaving(true);
    try {
      const finalDescription = itemDescription.trim() || selectedCategoryLabel;
      const months = ALL_MONTHS.reduce<Record<string, number>>((acc, m) => {
        acc[m] = itemAmount;
        return acc;
      }, {});

      let newItems: MonthlyBudgetItem[];
      if (editingIndex !== null) {
        newItems = [...(budget?.monthly_items || [])];
        newItems[editingIndex] = {
          category: itemCategory,
          description: finalDescription,
          months,
        };
      } else {
        // If an item with the same category + description already exists, set
        // it to recurring instead of creating a duplicate.
        const existingIdx = budget?.monthly_items?.findIndex(
          (it) =>
            it.category === itemCategory && it.description === finalDescription,
        );
        if (existingIdx !== undefined && existingIdx >= 0) {
          newItems = [...(budget?.monthly_items || [])];
          newItems[existingIdx] = {
            ...newItems[existingIdx],
            months,
          };
        } else {
          newItems = [
            ...(budget?.monthly_items || []),
            {
              category: itemCategory,
              description: finalDescription,
              months,
            },
          ];
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
  }, [
    currentGroup,
    budget,
    itemCategory,
    itemDescription,
    itemAmount,
    selectedCategoryLabel,
    editingIndex,
    updateBudget,
  ]);

  const handleDelete = useCallback(
    async (index: number) => {
      if (!currentGroup?.account_id || !budget?.monthly_items) return;
      const confirmDelete = window.confirm(
        '確定要刪除這個固定預算項目嗎？所有月份的此項目都會一併移除。',
      );
      if (!confirmDelete) return;
      const newItems = budget.monthly_items.filter((_, i) => i !== index);
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

  const totalPerMonth = recurringItems.reduce((sum, it) => sum + it.amount, 0);

  return (
    <>
      <section
        className="flex w-full flex-col gap-3 rounded-2xl border bg-gray-950 p-5 backdrop-blur-sm md:max-w-250"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2
              className="text-base font-bold text-gray-100"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              固定預算項目
            </h2>
            <p className="text-xs text-gray-400">
              每個月都會自動套用，例如房租、薪水、訂閱費用
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="text-primary-500 hover:text-primary-400 shrink-0 cursor-pointer text-sm font-semibold transition-colors"
          >
            + 新增固定項目
          </button>
        </header>

        {recurringItems.length > 0 ? (
          <>
            <ul className="flex flex-col gap-1.5">
              {recurringItems.map((item) => (
                <li
                  key={`recurring-${item.index}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-black/[0.08] bg-black/[0.02] px-3 py-2 transition-colors hover:bg-black/[0.04]"
                >
                  <div className="flex flex-1 items-center gap-2 overflow-hidden">
                    <span
                      aria-hidden
                      className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-black/[0.04] text-lg"
                    >
                      {item.category}
                    </span>
                    <div className="flex flex-col overflow-hidden">
                      <p className="truncate text-sm font-semibold text-gray-100">
                        {item.description}
                      </p>
                      <p
                        className="text-[11px] font-medium text-gray-400"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        ${normalizeNumber(item.amount)} / 月
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item.index)}
                      className="text-primary-400 min-h-8 min-w-8 rounded-lg p-2 transition-colors hover:bg-black/[0.05]"
                      aria-label="編輯"
                    >
                      <EditIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.index)}
                      className="min-h-8 min-w-8 rounded-lg p-2 transition-colors hover:bg-black/[0.05]"
                      style={{ color: 'var(--color-expense)' }}
                      aria-label="刪除"
                    >
                      <DeleteIcon className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p
              className="text-right text-xs font-medium text-gray-400"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              每月固定支出合計：
              <span className="ml-1 font-bold text-gray-200">
                ${normalizeNumber(totalPerMonth)}
              </span>
            </p>
          </>
        ) : (
          <p className="py-4 text-center text-xs text-gray-400">
            尚未新增固定項目。新增後會自動套用到全部月份。
          </p>
        )}
      </section>

      {modalOpen && (
        <Modal
          defaultOpen={true}
          onClose={() => setModalOpen(false)}
          className="flex w-full flex-col self-end sm:max-w-96 sm:self-center sm:rounded-xl"
          title={
            editingIndex !== null ? '編輯固定預算項目' : '新增固定預算項目'
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
                className="hover:border-primary-500 active:border-primary-500 h-10 w-full rounded-md border border-solid border-gray-600 bg-gray-900/40 px-3 py-1 text-gray-100 transition-colors"
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
                className="focus:border-primary-500 h-10 w-full rounded-md border border-solid border-gray-600 bg-gray-900/40 px-3 py-1 text-gray-100 placeholder:text-gray-500 focus:outline-none"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder={`例如：房租、薪水、Netflix（預設：${selectedCategoryLabel}）`}
              />
            </fieldset>

            <fieldset>
              <legend className="mb-2">每月金額（會套用到 1–12 月）</legend>
              <input
                type="number"
                className="focus:border-primary-500 h-10 w-full rounded-md border border-solid border-gray-600 bg-gray-900/40 px-3 py-1 text-gray-100 placeholder:text-gray-500 focus:outline-none"
                value={itemAmount || ''}
                onChange={(e) => setItemAmount(Number(e.target.value))}
                placeholder="例如：20000"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                之後仍可在下方各月份的卡片裡，為某個月份覆蓋成不同金額。
              </p>
            </fieldset>

            <div className="flex w-full justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="btn-secondary min-h-11"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex min-h-11 items-center justify-center px-6 disabled:cursor-not-allowed disabled:opacity-50"
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
    </>
  );
};
