import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useMemo } from 'react';
import { MdOutlineWallet } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { SpendingType } from '@/utils/constants';
import Link from 'next/link';

interface Props {
  costList: SpendingRecord[];
  isMobile: boolean;
  monthlyBudget?: number;
  budget?: Budget | null;
}

export default function OverView(props: Props) {
  const { monthlyBudget = 0, budget, costList } = props;

  // Memoize expensive expense calculation
  const { totalIncome, totalOutcome } = useMemo(
    () => getExpenseFromData(costList),
    [costList]
  );

  // Calculate spending by category for current month
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};

    costList.forEach((record) => {
      if (record.type === SpendingType.Outcome) {
        const category = record.category;
        spending[category] = (spending[category] || 0) + Number(record.amount);
      }
    });

    return spending;
  }, [costList]);

  // Get budget items for current month
  const currentMonthBudgetItems = useMemo(() => {
    if (!budget?.monthly_items) return [];

    const currentMonth = new Date().getMonth() + 1;
    const items: Array<{ category: string; description: string; budgeted: number; spent: number }> = [];

    budget.monthly_items.forEach((item) => {
      const budgetAmount = item.months?.[currentMonth.toString()];
      if (budgetAmount && budgetAmount > 0) {
        const spentAmount = categorySpending[item.category] || 0;
        items.push({
          category: item.category,
          description: item.description,
          budgeted: budgetAmount,
          spent: spentAmount,
        });
      }
    });

    // Sort by highest budget first
    return items.sort((a, b) => b.budgeted - a.budgeted);
  }, [budget, categorySpending]);

  const balance = monthlyBudget - totalOutcome;
  const usagePercentage = monthlyBudget > 0 ? (totalOutcome / monthlyBudget) * 100 : 0;
  const isOverBudget = balance < 0;
  const isWarning = usagePercentage >= 80 && !isOverBudget;

  return (
    <div className="bg-background relative flex w-full flex-col gap-5 rounded-2xl border border-solid border-gray-300 p-6 text-gray-700 shadow-sm transition-shadow duration-200 hover:shadow md:min-w-110">
      {/* Header with primary metric */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <MdOutlineWallet className="text-primary-400 size-5" />
            <h3 className="text-sm font-medium text-gray-500">本月預算結餘</h3>
          </div>
          <div className="mb-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold sm:text-4xl ${
                isOverBudget
                  ? 'text-red-600'
                  : isWarning
                    ? 'text-orange-600'
                    : 'text-primary-500'
              }`}
            >
              ${normalizeNumber(Math.abs(balance))}
            </span>
            {isOverBudget && (
              <span className="text-sm font-medium text-red-600">超支</span>
            )}
          </div>
          {/* Progress bar */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget
                  ? 'bg-red-500'
                  : isWarning
                    ? 'bg-orange-500'
                    : 'bg-primary-400'
              }`}
              style={{
                width: `${Math.min(usagePercentage, 100)}%`,
              }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <span>已使用 {usagePercentage.toFixed(1)}%</span>
            {isOverBudget && (
              <span className="font-medium text-red-600">
                超出 {((usagePercentage - 100)).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Financial breakdown grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1 rounded-lg bg-gray-50 p-3">
          <span className="text-xs text-gray-500">預算</span>
          <span className="text-base font-semibold text-gray-700 sm:text-lg">
            ${normalizeNumber(monthlyBudget)}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-lg bg-red-50 p-3">
          <span className="text-xs text-gray-500">支出</span>
          <span className="text-base font-semibold text-red-600 sm:text-lg">
            ${normalizeNumber(totalOutcome)}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-lg bg-green-50 p-3">
          <span className="text-xs text-gray-500">收入</span>
          <span className="text-base font-semibold text-green-600 sm:text-lg">
            ${normalizeNumber(totalIncome)}
          </span>
        </div>
      </div>

      {/* Category-based budget progress bars */}
      {currentMonthBudgetItems.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-gray-700">預算使用狀況</h4>
          <div className="flex max-h-80 flex-col gap-2.5 overflow-y-auto pr-1 md:max-h-96">
            {currentMonthBudgetItems.map((item) => {
              const usagePercent = item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
              const isOver = item.spent > item.budgeted;
              const isNearLimit = usagePercent >= 80 && !isOver;

              return (
                <div key={`${item.category}-${item.description}`} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="text-base">{item.category}</span>
                      <span className="text-gray-700">{item.description}</span>
                    </span>
                    <span className={`font-semibold ${isOver ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-gray-600'}`}>
                      ${normalizeNumber(item.spent)} / ${normalizeNumber(item.budgeted)}
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-primary-400'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{usagePercent.toFixed(1)}% 使用</span>
                    {isOver && (
                      <span className="font-medium text-red-600">
                        超支 ${normalizeNumber(item.spent - item.budgeted)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action button */}
      <Link
        href="/edit"
        className="bg-text text-background flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-800 active:bg-gray-800 sm:text-base"
        scroll={false}
      >
        <IoMdAdd className="size-5" />
        <span>立即新增帳目</span>
      </Link>
    </div>
  );
}
