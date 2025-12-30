import AddExpenseBtn from '@/app/transactions/AddExpenseBtn';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { MdOutlineWallet } from 'react-icons/md';

interface Props {
  costList: SpendingRecord[];
  isMobile: boolean;
  monthlyBudget?: number;
}

const UsagePieChart = dynamic(() => import('./UsagePieChart'), {
  ssr: false,
});

export default function OverView(props: Props) {
  const { monthlyBudget = 0, costList, isMobile } = props;

  // Memoize expensive expense calculation
  const { totalIncome, totalOutcome } = useMemo(
    () => getExpenseFromData(costList),
    [costList]
  );

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

        {/* Pie chart - smaller on mobile */}
        {!isMobile && (
          <UsagePieChart
            totalIncome={monthlyBudget}
            totalOutcome={totalOutcome}
            isMobile={isMobile}
          />
        )}
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

      {/* Action button */}
      <AddExpenseBtn className="w-full text-sm sm:text-base">
        立即新增帳目
      </AddExpenseBtn>
    </div>
  );
}
