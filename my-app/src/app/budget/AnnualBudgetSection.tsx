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

  const spent = useMemo(() => {
    const { totalOutcome } = getExpenseFromData(yearlySpending);
    return totalOutcome;
  }, [yearlySpending]);

  const percentage = annualBudget ? (spent / annualBudget) * 100 : 0;

  return (
    <div
      className="flex w-full flex-col gap-3 rounded-2xl border border-white/[0.06] bg-gray-800/80 p-5 shadow-md backdrop-blur-sm"
      style={{ textWrap: 'pretty' }}
    >
      <span
        className="text-[11px] font-semibold uppercase text-gray-400"
        style={{ letterSpacing: '0.12em' }}
      >
        年度預算
      </span>
      <p
        className="text-2xl font-extrabold text-gray-100 sm:text-3xl"
        style={{
          fontFamily: 'var(--font-heading)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        ${normalizeNumber(annualBudget)}
      </p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: 'var(--color-primary-500)',
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
