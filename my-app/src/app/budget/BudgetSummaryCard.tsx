'use client';

import { useBudgetCtx } from '@/context/BudgetProvider';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useMemo } from 'react';

interface Props {
  yearlySpending: SpendingRecord[];
}

const fillVarFor = (percentage: number) =>
  percentage >= 100
    ? '--color-over-budget'
    : percentage >= 80
      ? '--color-warning'
      : '--color-primary-500';

/** 年度與本月預算併成一張卡，共用同一組進度條語彙。 */
export const BudgetSummaryCard = ({ yearlySpending }: Props) => {
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

  const annualSpent = useMemo(
    () => getExpenseFromData(yearlySpending).totalOutcome,
    [yearlySpending],
  );

  const { monthlyBudget, monthlySpent } = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;

    let budgetTotal = 0;
    if (budget?.monthly_items) {
      budget.monthly_items.forEach((item) => {
        const monthAmount = item.months?.[currentMonth.toString()];
        if (monthAmount) budgetTotal += monthAmount;
      });
    }

    const currentMonthRecords = yearlySpending.filter(
      (record) => new Date(record.date).getMonth() + 1 === currentMonth,
    );

    return {
      monthlyBudget: budgetTotal,
      monthlySpent: getExpenseFromData(currentMonthRecords).totalOutcome,
    };
  }, [budget?.monthly_items, yearlySpending]);

  const annualPercentage = annualBudget
    ? (annualSpent / annualBudget) * 100
    : 0;
  const monthlyPercentage = monthlyBudget
    ? (monthlySpent / monthlyBudget) * 100
    : 0;
  const monthlyRemaining = monthlyBudget - monthlySpent;

  return (
    <div
      className="flex w-full flex-col gap-4.5 rounded-[18px] border border-black/[0.08] bg-gray-950 p-5 md:max-w-250"
      style={{ textWrap: 'pretty' }}
    >
      <Stat
        label="年度預算"
        amount={annualBudget}
        percentage={annualPercentage}
        detail={`已使用 $${normalizeNumber(annualSpent)} · ${annualPercentage.toFixed(1)}%`}
      />

      <span
        aria-hidden
        className="h-px w-full"
        style={{ backgroundColor: 'var(--color-border-light)' }}
      />

      <Stat
        label="本月預算"
        labelColor="var(--color-primary-500)"
        amount={monthlyBudget}
        percentage={monthlyPercentage}
        detail={
          monthlyBudget > 0
            ? `已使用 $${normalizeNumber(monthlySpent)} · ${monthlyPercentage.toFixed(1)}% · ${
                monthlyRemaining < 0
                  ? `超支 $${normalizeNumber(-monthlyRemaining)}`
                  : `剩餘 $${normalizeNumber(monthlyRemaining)}`
              }`
            : '尚未設定本月預算'
        }
      />
    </div>
  );
};

const Stat = ({
  label,
  labelColor,
  amount,
  percentage,
  detail,
}: {
  label: string;
  labelColor?: string;
  amount: number;
  percentage: number;
  detail: string;
}) => (
  <div className="flex flex-col gap-2">
    <span
      className="text-[11px] font-semibold uppercase"
      style={{
        letterSpacing: '0.12em',
        color: labelColor ?? 'var(--color-text-tertiary)',
      }}
    >
      {label}
    </span>
    <p
      className="text-[26px] font-extrabold text-gray-100"
      style={{
        fontFamily: 'var(--font-heading)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}
    >
      ${normalizeNumber(amount)}
    </p>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${Math.min(percentage, 100)}%`,
          backgroundColor: `var(${fillVarFor(percentage)})`,
        }}
      />
    </div>
    <p
      className="text-[11px] font-semibold text-gray-400"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {detail}
    </p>
  </div>
);
