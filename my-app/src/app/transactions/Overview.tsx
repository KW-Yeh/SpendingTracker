import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useMemo, useState } from 'react';
import { MdOutlineWallet } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { CATEGORY_WORDING_MAP, SpendingType } from '@/utils/constants';
import Link from 'next/link';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

interface Props {
  costList: SpendingRecord[];
  isMobile: boolean;
  monthlyBudget?: number;
  budget?: Budget | null;
}

export default function OverView(props: Props) {
  const { monthlyBudget = 0, budget, costList } = props;
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false);

  // Memoize expensive expense calculation
  const { totalIncome, totalOutcome } = useMemo(
    () => getExpenseFromData(costList),
    [costList],
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

  // Get budget items for current month, aggregated by category
  const currentMonthBudgetItems = useMemo(() => {
    if (!budget?.monthly_items) return [];

    const currentMonth = new Date().getMonth() + 1;
    const categoryMap: Record<
      string,
      { category: string; budgeted: number; spent: number }
    > = {};

    budget.monthly_items.forEach((item) => {
      const budgetAmount = item.months?.[currentMonth.toString()];
      if (budgetAmount && budgetAmount > 0) {
        const category = item.category;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category,
            budgeted: 0,
            spent: categorySpending[category] || 0,
          };
        }

        categoryMap[category].budgeted += budgetAmount;
      }
    });

    // Convert to array and sort by highest budget first
    return Object.values(categoryMap).sort((a, b) => b.budgeted - a.budgeted);
  }, [budget, categorySpending]);

  const balance = monthlyBudget - totalOutcome;
  const usagePercentage =
    monthlyBudget > 0 ? (totalOutcome / monthlyBudget) * 100 : 0;
  const isOverBudget = balance < 0;
  const isWarning = usagePercentage >= 80 && !isOverBudget;

  return (
    <div className="card relative flex w-full flex-col gap-5 text-gray-300 transition-all duration-200 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] md:min-w-110">
      {/* Header with primary metric */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <MdOutlineWallet className="text-primary-400 size-6" />
            <h3 className="text-sm font-semibold text-gray-400">
              本月預算結餘
            </h3>
          </div>
          <div className="mb-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold sm:text-4xl ${
                isOverBudget
                  ? 'text-secondary-400'
                  : isWarning
                    ? 'text-primary-400'
                    : 'text-primary-400'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ${normalizeNumber(Math.abs(balance))}
            </span>
            {isOverBudget && (
              <span className="text-secondary-400 text-sm font-semibold">
                超支
              </span>
            )}
          </div>
          {/* Progress bar */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-700/50">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget
                  ? 'from-secondary-500 to-secondary-600 bg-linear-to-r shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                  : isWarning
                    ? 'from-primary-500 to-accent-500 bg-linear-to-r shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'from-primary-400 to-primary-500 bg-linear-to-r shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              }`}
              style={{
                width: `${Math.min(usagePercentage, 100)}%`,
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-medium text-gray-400">
            <span>已使用 {usagePercentage.toFixed(1)}%</span>
            {isOverBudget && (
              <span className="text-secondary-400 font-semibold">
                超出 {(usagePercentage - 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Financial breakdown grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-accent-500/10 border-accent-500/30 flex flex-col gap-1.5 rounded-xl border p-3.5 backdrop-blur-sm">
          <span className="text-accent-400 text-xs font-medium">預算</span>
          <span className="text-accent-300 text-base font-bold sm:text-lg">
            ${normalizeNumber(monthlyBudget)}
          </span>
        </div>

        <div className="bg-secondary-500/10 border-secondary-500/30 flex flex-col gap-1.5 rounded-xl border p-3.5 backdrop-blur-sm">
          <span className="text-secondary-400 text-xs font-medium">支出</span>
          <span className="text-secondary-300 text-base font-bold sm:text-lg">
            ${normalizeNumber(totalOutcome)}
          </span>
        </div>

        <div className="bg-income-500/10 border-income-500/30 flex flex-col gap-1.5 rounded-xl border p-3.5 backdrop-blur-sm">
          <span className="text-income-400 text-xs font-medium">收入</span>
          <span className="text-income-300 text-base font-bold sm:text-lg">
            ${normalizeNumber(totalIncome)}
          </span>
        </div>
      </div>

      {/* Category-based budget cards - Accordion */}
      {currentMonthBudgetItems.length > 0 && (
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-gray-700/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.15)]"
          >
            <h4 className="text-sm font-semibold text-gray-300">
              預算使用狀況
            </h4>
            {isBudgetExpanded ? (
              <IoChevronUp className="text-primary-400 size-4" />
            ) : (
              <IoChevronDown className="text-primary-400 size-4" />
            )}
          </button>

          {isBudgetExpanded && (
            <div className="mt-2 grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1 md:max-h-96">
              {currentMonthBudgetItems.map((item) => {
                const usagePercent =
                  item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
                const isOver = item.spent > item.budgeted;
                const isNearLimit = usagePercent >= 80 && !isOver;

                return (
                  <div
                    key={item.category}
                    className={`flex flex-col gap-2 rounded-xl border-2 p-3 shadow-sm backdrop-blur-sm transition-all duration-200 ${
                      isOver
                        ? 'border-secondary-500/50 bg-secondary-500/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                        : isNearLimit
                          ? 'border-primary-500/50 bg-primary-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'border-gray-600 bg-gray-700/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-200">
                        {CATEGORY_WORDING_MAP[item.category]}
                      </span>
                      <span
                        className={`text-xs font-extrabold ${
                          isOver
                            ? 'text-secondary-400'
                            : isNearLimit
                              ? 'text-primary-400'
                              : 'text-primary-400'
                        }`}
                      >
                        {usagePercent.toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-medium text-gray-400">
                          已使用
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            isOver
                              ? 'text-secondary-300'
                              : isNearLimit
                                ? 'text-primary-300'
                                : 'text-gray-200'
                          }`}
                        >
                          ${normalizeNumber(item.spent)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-medium text-gray-400">
                          預算
                        </span>
                        <span className="text-xs font-semibold text-gray-300">
                          ${normalizeNumber(item.budgeted)}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700/50">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver
                            ? 'from-secondary-500 to-secondary-600 bg-linear-to-r shadow-[0_0_8px_rgba(139,92,246,0.6)]'
                            : isNearLimit
                              ? 'from-primary-500 to-accent-500 bg-linear-to-r shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                              : 'from-primary-400 to-primary-500 bg-linear-to-r shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                        }`}
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>

                    {isOver && (
                      <div className="bg-secondary-500/20 border-secondary-500/40 mt-0.5 rounded-lg border px-2 py-1">
                        <span className="text-secondary-300 text-[10px] font-bold">
                          超支 ${normalizeNumber(item.spent - item.budgeted)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Action button */}
      <Link
        href="/edit"
        className="btn-primary flex w-full items-center justify-center gap-2 text-sm font-semibold sm:text-base"
        scroll={false}
      >
        <IoMdAdd className="size-5" />
        <span>立即新增帳目</span>
      </Link>
    </div>
  );
}
