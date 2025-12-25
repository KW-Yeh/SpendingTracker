'use client';

import { useBudgetCtx } from '@/context/BudgetProvider';
import { normalizeNumber } from '@/utils/normalizeNumber';

export const MonthlyBudgetSection = () => {
  const { budget } = useBudgetCtx();

  const monthlyBudget = budget?.monthly_budget || 0;
  // TODO: Calculate spent from current month transactions
  const spent = 0;
  const percentage = monthlyBudget ? (spent / monthlyBudget) * 100 : 0;

  return (
    <div className="bg-background w-full rounded-xl p-6 shadow">
      <h2 className="text-xl font-bold">本月預算</h2>

      <div className="mt-4">
        <p className="text-3xl font-bold">{normalizeNumber(monthlyBudget)} 元</p>
        <p className="text-sm text-gray-500">(由月度項目自動計算)</p>

        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${
              percentage > 100
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}
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
