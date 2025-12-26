'use client';

import { useBudgetCtx } from '@/context/BudgetProvider';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { useMemo } from 'react';

interface Props {
  yearlySpending: SpendingRecord[];
}

export const AnnualBudgetSection = ({ yearlySpending }: Props) => {
  const { budget } = useBudgetCtx();

  // Calculate annual budget from all monthly items
  const annualBudget = useMemo(() => {
    if (!budget?.monthly_items || budget.monthly_items.length === 0) return 0;

    let total = 0;
    budget.monthly_items.forEach((item) => {
      Object.values(item.months || {}).forEach((amount) => {
        total += amount;
      });
    });
    return total;
  }, [budget?.monthly_items]);

  // Calculate spent from transactions
  const spent = useMemo(() => {
    const { totalOutcome } = getExpenseFromData(yearlySpending);
    return totalOutcome;
  }, [yearlySpending]);

  const percentage = annualBudget ? (spent / annualBudget) * 100 : 0;

  return (
    <div className="bg-background w-full rounded-xl p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">年度預算</h2>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold">{normalizeNumber(annualBudget)} 元</p>
        <p className="text-sm text-gray-500">(自動計算)</p>
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
    </div>
  );
};
