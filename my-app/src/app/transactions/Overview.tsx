import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { useMemo, useState } from 'react';
import { CATEGORY_WORDING_MAP, SpendingType } from '@/utils/constants';
import Link from 'next/link';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

interface Props {
  costList: SpendingRecord[];
  isMobile: boolean;
  monthlyBudget?: number;
  budget?: Budget | null;
  selectedMonth?: number;
}

export default function OverView(props: Props) {
  const {
    monthlyBudget = 0,
    budget,
    costList,
    selectedMonth = new Date().getMonth() + 1,
  } = props;
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false);

  const { totalIncome, totalOutcome } = useMemo(
    () => getExpenseFromData(costList),
    [costList],
  );

  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    costList.forEach((record) => {
      if (record.type === SpendingType.Outcome) {
        spending[record.category] =
          (spending[record.category] || 0) + Number(record.amount);
      }
    });
    return spending;
  }, [costList]);

  const currentMonthBudgetItems = useMemo(() => {
    if (!budget?.monthly_items) return [];
    const categoryMap: Record<
      string,
      { category: string; budgeted: number; spent: number }
    > = {};
    budget.monthly_items.forEach((item) => {
      const budgetAmount = item.months?.[selectedMonth.toString()];
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
    return Object.values(categoryMap).sort((a, b) => b.budgeted - a.budgeted);
  }, [budget, categorySpending, selectedMonth]);

  const overBudgetItems = useMemo(
    () => currentMonthBudgetItems.filter((it) => it.spent > it.budgeted),
    [currentMonthBudgetItems],
  );

  const balance = monthlyBudget - totalOutcome;
  const usagePercentage =
    monthlyBudget > 0 ? (totalOutcome / monthlyBudget) * 100 : 0;
  const isOverBudget = balance < 0;
  const isWarning = usagePercentage >= 80 && !isOverBudget;

  const remainingPercent = Math.max(0, 100 - usagePercentage);

  const progressFillStyle = isOverBudget
    ? { backgroundColor: 'var(--color-over-budget)' }
    : isWarning
      ? { backgroundColor: 'var(--color-warning)' }
      : { backgroundColor: 'var(--color-primary-500)' };

  const markerLeft = `${Math.min(usagePercentage, 100)}%`;

  return (
    <div
      className="relative flex w-full flex-col gap-5 rounded-2xl border border-black/[0.08] bg-gray-950 p-5 text-gray-300 backdrop-blur-sm md:min-w-110"
      style={{ textWrap: 'pretty' }}
    >
      {/* Hero — 主結餘數字 */}
      <div className="flex flex-col gap-3">
        <span
          className="text-[11px] font-semibold tracking-[0.12em] text-gray-400 uppercase"
          style={{ letterSpacing: '0.12em' }}
        >
          本月預算結餘
        </span>
        <div className="flex items-baseline gap-3">
          <span
            className="font-extrabold text-gray-50 tabular-nums"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 9vw, 2.625rem)', // ~36–42px
              fontVariantNumeric: 'tabular-nums',
              color: isOverBudget ? 'var(--color-over-budget)' : undefined,
            }}
          >
            ${normalizeNumber(Math.abs(balance))}
          </span>
          <span
            className="text-xs font-semibold"
            style={{
              color: isOverBudget
                ? 'var(--color-over-budget)'
                : 'var(--color-text-tertiary)',
            }}
          >
            {isOverBudget ? '超支' : `剩 ${remainingPercent.toFixed(0)}%`}
          </span>
        </div>

        {/* Slim progress bar with marker */}
        <div className="relative h-1.5 w-full overflow-visible rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              ...progressFillStyle,
              width: `${Math.min(usagePercentage, 100)}%`,
            }}
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-900 transition-all duration-300"
            style={{
              left: markerLeft,
              width: 10,
              height: 10,
              ...progressFillStyle,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400">
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            已使用 {usagePercentage.toFixed(1)}%
          </span>
          {isOverBudget && (
            <span
              className="font-semibold"
              style={{
                color: 'var(--color-over-budget)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              超出 {(usagePercentage - 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* 收支雙卡 (取代 3 卡) */}
      <div className="grid grid-cols-2 gap-3">
        <Tile
          label="本月收入"
          amount={totalIncome}
          colorVar="--color-income"
          mutedBgVar="--color-income-bg"
        />
        <Tile
          label="本月支出"
          amount={totalOutcome}
          colorVar="--color-expense"
          mutedBgVar="--color-expense-bg"
        />
      </div>

      {/* 預算超支警告 */}
      {overBudgetItems.length > 0 && (
        <Link
          href="/budget"
          className="flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-colors hover:bg-black/[0.03]"
          style={{
            borderColor: 'rgba(227,0,0,0.25)',
            backgroundColor: 'var(--color-over-budget-bg)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-flex size-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-over-budget)' }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--color-over-budget)' }}
            >
              {overBudgetItems.length} 個類別超支
            </span>
          </div>
          <span className="text-[11px] font-medium text-gray-400">
            查看預算 →
          </span>
        </Link>
      )}

      {/* 類別預算 accordion - 保留但 recolor */}
      {currentMonthBudgetItems.length > 0 && (
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-black/[0.04]"
          >
            <span
              className="text-[11px] font-semibold text-gray-400"
              style={{ letterSpacing: '0.12em' }}
            >
              預算使用狀況
            </span>
            {isBudgetExpanded ? (
              <IoChevronUp className="size-4 text-gray-400" />
            ) : (
              <IoChevronDown className="size-4 text-gray-400" />
            )}
          </button>

          {isBudgetExpanded && (
            <div className="mt-2 grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1 md:max-h-96">
              {currentMonthBudgetItems.map((item) => {
                const usagePercent =
                  item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
                const isOver = item.spent > item.budgeted;
                const isNearLimit = usagePercent >= 80 && !isOver;
                const fillVar = isOver
                  ? '--color-over-budget'
                  : isNearLimit
                    ? '--color-warning'
                    : '--color-primary-500';

                return (
                  <div
                    key={item.category}
                    className="flex flex-col gap-2 rounded-xl border p-3 transition-colors"
                    style={{
                      borderColor: isOver
                        ? 'rgba(248,113,113,0.3)'
                        : 'rgba(255,255,255,0.06)',
                      backgroundColor: isOver
                        ? 'rgba(248,113,113,0.06)'
                        : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-200">
                        {CATEGORY_WORDING_MAP[item.category]}
                      </span>
                      <span
                        className="text-xs font-extrabold"
                        style={{
                          color: `var(${fillVar})`,
                          fontVariantNumeric: 'tabular-nums',
                        }}
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
                          className="text-sm font-bold text-gray-100"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          ${normalizeNumber(item.spent)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-medium text-gray-400">
                          預算
                        </span>
                        <span
                          className="text-xs font-semibold text-gray-300"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          ${normalizeNumber(item.budgeted)}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-1 w-full overflow-hidden rounded-full bg-black/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(usagePercent, 100)}%`,
                          backgroundColor: `var(${fillVar})`,
                        }}
                      />
                    </div>

                    {isOver && (
                      <span
                        className="text-[10px] font-bold"
                        style={{
                          color: 'var(--color-over-budget)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        超支 ${normalizeNumber(item.spent - item.budgeted)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Tile({
  label,
  amount,
  colorVar,
  mutedBgVar,
}: {
  label: string;
  amount: number;
  colorVar: string;
  mutedBgVar: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 rounded-xl border border-black/[0.08] px-3.5 py-3"
      style={{ backgroundColor: `var(${mutedBgVar})` }}
    >
      <span
        className="text-[11px] font-medium"
        style={{
          color: `var(${colorVar})`,
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </span>
      <span
        className="text-xl font-extrabold tabular-nums"
        style={{
          color: `var(${colorVar})`,
          fontVariantNumeric: 'tabular-nums',
          fontFamily: 'var(--font-heading)',
        }}
      >
        ${normalizeNumber(amount)}
      </span>
    </div>
  );
}
