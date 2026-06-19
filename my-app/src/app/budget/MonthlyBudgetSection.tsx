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

  const { monthlyBudget, spent } = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;

    let budgetTotal = 0;
    if (budget?.monthly_items) {
      budget.monthly_items.forEach((item) => {
        const monthAmount = item.months?.[currentMonth.toString()];
        if (monthAmount) budgetTotal += monthAmount;
      });
    }

    const currentMonthRecords = yearlySpending.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() + 1 === currentMonth;
    });
    const { totalOutcome } = getExpenseFromData(currentMonthRecords);

    return { monthlyBudget: budgetTotal, spent: totalOutcome };
  }, [budget?.monthly_items, yearlySpending]);

  const percentage = monthlyBudget ? (spent / monthlyBudget) * 100 : 0;
  const isOver = percentage >= 100;
  const isWarning = percentage >= 80 && !isOver;
  const fillVar = isOver
    ? '--color-over-budget'
    : isWarning
      ? '--color-warning'
      : '--color-primary-500';

  return (
    <div
      className="relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border p-5 backdrop-blur-sm"
      style={{
        borderColor: 'rgba(0, 102, 204, 0.30)',
        background: 'var(--color-bg-primary)',
        textWrap: 'pretty',
      }}
    >
      <span
        className="text-[11px] font-semibold uppercase"
        style={{
          letterSpacing: '0.12em',
          color: 'var(--color-primary-500)',
        }}
      >
        本月預算
      </span>
      <p
        className="text-2xl font-extrabold text-gray-100 sm:text-3xl"
        style={{
          fontFamily: 'var(--font-heading)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        ${normalizeNumber(monthlyBudget)}
      </p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: `var(${fillVar})`,
          }}
        />
      </div>
      <p
        className="text-xs font-medium text-gray-400"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        已使用 ${normalizeNumber(spent)} ({percentage.toFixed(1)}%)
      </p>
    </div>
  );
};
