'use client';

import { Modal } from '@/components/Modal';
import { Loading } from '@/components/icons/Loading';
import { useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useState, useCallback } from 'react';

export const AnnualBudgetSection = () => {
  const { budget, updateBudget, loading } = useBudgetCtx();
  const { currentGroup } = useGroupCtx();
  const [modalOpen, setModalOpen] = useState(false);
  const [annualBudget, setAnnualBudget] = useState(
    budget?.annual_budget || 0,
  );
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!currentGroup?.account_id) return;

    setSaving(true);
    try {
      await updateBudget({
        budget_id: budget?.budget_id,
        account_id: currentGroup.account_id,
        annual_budget: annualBudget,
        monthly_items: budget?.monthly_items || [],
      });
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('儲存失敗，請稍後再試');
    } finally {
      setSaving(false);
    }
  }, [currentGroup, budget, annualBudget, updateBudget]);

  // TODO: Calculate spent from transactions
  const spent = 0;
  const percentage = budget?.annual_budget
    ? (spent / budget.annual_budget) * 100
    : 0;

  return (
    <div className="bg-background w-full rounded-xl p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">年度預算</h2>
        <button
          type="button"
          onClick={() => {
            setAnnualBudget(budget?.annual_budget || 0);
            setModalOpen(true);
          }}
          className="text-primary-500 hover:text-primary-600 text-sm"
        >
          編輯
        </button>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold">
          {normalizeNumber(budget?.annual_budget || 0)} 元
        </p>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          已使用 {normalizeNumber(spent)} 元 ({percentage.toFixed(1)}%)
        </p>
      </div>

      {modalOpen && (
        <Modal
          defaultOpen={true}
          onClose={() => setModalOpen(false)}
          className="flex w-full flex-col self-end sm:max-w-96 sm:self-center sm:rounded-xl"
          title="編輯年度預算"
        >
          <div className="flex w-full flex-col gap-4">
            <fieldset>
              <legend className="mb-2">年度預算金額</legend>
              <input
                type="number"
                className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1"
                value={annualBudget}
                onChange={(e) => setAnnualBudget(Number(e.target.value))}
                placeholder="120000"
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
                onClick={handleSave}
                disabled={saving}
                className="bg-text text-background flex items-center justify-center rounded-lg px-6 py-2 font-bold transition-colors hover:bg-gray-800 active:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {saving ? <Loading className="size-5 animate-spin" /> : '儲存'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
