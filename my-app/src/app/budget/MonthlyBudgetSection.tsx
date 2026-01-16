'use client';

import { useBudgetCtx } from '@/context/BudgetProvider';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { useMemo } from 'react';

interface Props {
  yearlySpending: SpendingRecord[];
}

export const MonthlyBudgetSection = ({ yearlySpending }: Props) => {
  const { budget } = useBudgetCtx();

  // Calculate current month's budget and spending
  const { monthlyBudget, spent } = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;

    // Calculate budget
    let budgetTotal = 0;
    if (budget?.monthly_items) {
      budget.monthly_items.forEach((item) => {
        const monthAmount = item.months?.[currentMonth.toString()];
        if (monthAmount) {
          budgetTotal += monthAmount;
        }
      });
    }

    // Calculate spent
    const currentMonthRecords = yearlySpending.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() + 1 === currentMonth;
    });
    const { totalOutcome } = getExpenseFromData(currentMonthRecords);

    return {
      monthlyBudget: budgetTotal,
      spent: totalOutcome,
    };
  }, [budget?.monthly_items, yearlySpending]);

  const percentage = monthlyBudget ? (spent / monthlyBudget) * 100 : 0;

  return (
    <div className="card w-full">
      <h2
        className="text-xl font-bold text-gray-800"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        本月預算
      </h2>

      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">
          {normalizeNumber(monthlyBudget)} 元
        </p>
        <p className="text-sm text-gray-300">(由月度項目自動計算)</p>

        <div className="mt-3 h-3 w-full rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full shadow-warm transition-all duration-300 ${
              percentage > 100
                ? 'bg-secondary-500'
                : 'bg-linear-to-r from-primary-500 to-accent-500'
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
