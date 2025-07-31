'use client';

import { Loading } from '@/components/icons/Loading';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import {
  BUDGET_PERIOD_OPTIONS,
  BUDGET_PERIOD_WORDINGS,
  CATEGORY_WORDING_MAP,
  OUTCOME_TYPE_MAP,
} from '@/utils/constants';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import { useCallback, useState } from 'react';

interface Props {
  budget: BudgetItem | null;
  onSave: (item: BudgetItem, isNew: boolean) => void;
  onClose: () => void;
  loading: boolean;
}

export const EditBudgetModal = (props: Props) => {
  const { budget, onSave, onClose, loading } = props;
  const [selectedCategory, setSelectedCategory] = useState(
    budget?.category ?? '🍔',
  );
  const [selectedPeriod, setSelectedPeriod] = useState(
    budget?.period ?? 'monthly',
  );
  const [description, setDescription] = useState(budget?.name ?? '');
  const [amount, setAmount] = useState(budget?.amount ?? 0);

  const handleSave = useCallback(() => {
    onSave(
      {
        category: selectedCategory,
        period: selectedPeriod,
        name: description,
        amount: amount,
      },
      false,
    );
  }, [onSave, selectedCategory, selectedPeriod, description, amount]);

  return (
    <Modal
      defaultOpen={true}
      onClose={onClose}
      className="flex w-full flex-col gap-4 self-end sm:max-w-96 sm:self-center sm:rounded-xl"
      title={!budget ? '新增預算' : '編輯預算'}
    >
      <div className="flex w-full items-center justify-between gap-4 py-2">
        <fieldset className="flex-1">
          <legend>類別</legend>
          <Select
            name="category"
            value={selectedCategory}
            label={
              <span className="flex items-center gap-2">
                {getCategoryIcon(selectedCategory)}
                <span>{CATEGORY_WORDING_MAP[selectedCategory]}</span>
              </span>
            }
            onChange={setSelectedCategory}
            className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1 transition-colors hover:border-gray-500 active:border-gray-500"
          >
            {OUTCOME_TYPE_MAP.map((category) => (
              <Select.Item key={category.value} value={category.value}>
                <span className="flex items-center gap-2">
                  {getCategoryIcon(category.value)}
                  <span>{category.label}</span>
                </span>
              </Select.Item>
            ))}
          </Select>
        </fieldset>
        <fieldset className="flex-1">
          <legend>週期</legend>
          <Select
            name="period"
            value={selectedPeriod}
            label={BUDGET_PERIOD_WORDINGS[selectedPeriod]}
            onChange={setSelectedPeriod}
            className="h-10 w-full rounded-md border border-solid border-gray-300 px-3 py-1 transition-colors hover:border-gray-500 active:border-gray-500"
          >
            {BUDGET_PERIOD_OPTIONS.map((period) => (
              <Select.Item key={period} value={period}>
                {BUDGET_PERIOD_WORDINGS[period]}
              </Select.Item>
            ))}
          </Select>
        </fieldset>
      </div>

      <div className="flex w-full items-center justify-between gap-4 py-2">
        <fieldset className="flex-1">
          <legend>名稱</legend>
          <input
            type="text"
            id="name"
            name="name"
            className="h-10 w-full rounded-md border border-solid border-gray-300 px-2 py-1 transition-colors group-hover:border-gray-500 group-active:border-gray-500 focus:outline-0"
            autoComplete="off"
            placeholder="描述"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
          />
        </fieldset>
        <fieldset className="flex-1">
          <legend>預算</legend>
          <input
            type="number"
            id="amount"
            name="amount"
            className="h-10 w-full rounded-md border border-solid border-gray-300 px-2 py-1 transition-colors group-hover:border-gray-500 group-active:border-gray-500 focus:outline-0"
            autoComplete="off"
            placeholder="1000"
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
            value={amount}
          />
        </fieldset>
      </div>

      <div className="mt-10 flex w-full flex-1 items-end justify-between">
        <button
          disabled={loading}
          type="button"
          onClick={onClose}
          className="bg-background flex w-24 items-center justify-center rounded-lg border border-solid border-gray-300 p-2 text-gray-300 transition-colors hover:border-gray-500 hover:text-gray-500 active:border-gray-500 active:text-gray-500"
        >
          <span>取消</span>
        </button>
        <button
          disabled={loading}
          type="button"
          onClick={handleSave}
          className="submit-button flex w-36 items-center justify-center"
        >
          {loading && (
            <Loading className="size-6 animate-spin py-1 text-white" />
          )}
          {!loading && <span>送出</span>}
        </button>
      </div>
    </Modal>
  );
};
