'use client';

import { ChartContainer } from '@/app/analysis/ChartContainer';
import { YearMonthFilter } from '@/app/analysis/YearMonthFilter';
import { AnalysisSkeleton } from '@/components/skeletons/AnalysisSkeleton';
import { useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useYearMonth } from '@/hooks/useYearMonth';
import { calSpending2Chart } from '@/utils/calSpending2Chart';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { CATEGORY_WORDING_MAP, SpendingType, Necessity } from '@/utils/constants';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo } from 'react';
import ExpenseCostTable from './ExpenseCostTable';
import NecessityCostTable from './NecessityCostTable';
import BudgetCostTable from './BudgetCostTable';

const ExpensePieChart = dynamic(() => import('./ExpensePieChart'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-15 aspect-square size-45 rounded-full bg-gray-200 p-1.5">
      <div className="bg-background size-full rounded-full p-1.5">
        <div className="size-full rounded-full bg-gray-200 p-5">
          <div className="bg-background size-full rounded-full"></div>
        </div>
      </div>
    </div>
  ),
});

const NecessityPieChart = dynamic(() => import('./NecessityPieChart'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-15 aspect-square size-45 rounded-full bg-gray-200 p-1.5">
      <div className="bg-background size-full rounded-full p-1.5">
        <div className="size-full rounded-full bg-gray-200 p-5">
          <div className="bg-background size-full rounded-full"></div>
        </div>
      </div>
    </div>
  ),
});

const BudgetPieChart = dynamic(() => import('./BudgetPieChart'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-15 aspect-square size-45 rounded-full bg-gray-200 p-1.5">
      <div className="bg-background size-full rounded-full p-1.5">
        <div className="size-full rounded-full bg-gray-200 p-5">
          <div className="bg-background size-full rounded-full"></div>
        </div>
      </div>
    </div>
  ),
});

export const ChartBlock = () => {
  useScrollToTop();
  const { config: userData } = useUserConfigCtx();
  const { data, syncData, loading, isInitialLoad } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const { budget } = useBudgetCtx();
  const today = new Date();
  const dateHook = useYearMonth(today);

  const refreshData = useCallback(
    (_groupId: string | undefined, _year: string, _month: string) => {
      const { startDate, endDate } = getStartEndOfMonth(
        new Date(Number(_year), Number(_month) - 1),
      );
      syncData(
        _groupId,
        userData?.email,
        startDate.toISOString(),
        endDate.toISOString(),
      );
    },
    [syncData, userData?.email],
  );

  // Memoize filtered data and chart calculation
  const chartData = useMemo(() => {
    const filteredData = data.filter(
      (record) =>
        `${new Date(record.date).getFullYear()}` === dateHook.year &&
        `${new Date(record.date).getMonth() + 1}` === dateHook.month,
    );

    return calSpending2Chart(filteredData);
  }, [data, dateHook.year, dateHook.month]);

  // Calculate budget analysis data
  const budgetAnalysis = useMemo(() => {
    if (!budget?.monthly_items) {
      return {
        totalBudgeted: 0,
        totalSpent: 0,
        totalNecessary: 0,
        totalUnnecessary: 0,
        categoryBreakdown: [],
      };
    }

    const currentMonth = Number(dateHook.month);
    const categoryMap: Record<string, { budgeted: number; spent: number; necessary: number; unnecessary: number }> = {};

    // Get budgeted amounts
    budget.monthly_items.forEach((item) => {
      const budgetAmount = item.months?.[currentMonth.toString()];
      if (budgetAmount && budgetAmount > 0) {
        const category = CATEGORY_WORDING_MAP[item.category] || item.category;
        if (!categoryMap[category]) {
          categoryMap[category] = { budgeted: 0, spent: 0, necessary: 0, unnecessary: 0 };
        }
        categoryMap[category].budgeted += budgetAmount;
      }
    });

    // Get spent amounts
    data.forEach((record) => {
      if (
        record.type === SpendingType.Outcome &&
        `${new Date(record.date).getFullYear()}` === dateHook.year &&
        `${new Date(record.date).getMonth() + 1}` === dateHook.month
      ) {
        const category = CATEGORY_WORDING_MAP[record.category] || record.category;
        if (!categoryMap[category]) {
          categoryMap[category] = { budgeted: 0, spent: 0, necessary: 0, unnecessary: 0 };
        }
        const amount = Number(record.amount);
        categoryMap[category].spent += amount;

        if (record.necessity === Necessity.Need) {
          categoryMap[category].necessary += amount;
        } else {
          categoryMap[category].unnecessary += amount;
        }
      }
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, values]) => ({
      category,
      ...values,
    }));

    const totalBudgeted = categoryBreakdown.reduce((sum, item) => sum + item.budgeted, 0);
    const totalSpent = categoryBreakdown.reduce((sum, item) => sum + item.spent, 0);
    const totalNecessary = categoryBreakdown.reduce((sum, item) => sum + item.necessary, 0);
    const totalUnnecessary = categoryBreakdown.reduce((sum, item) => sum + item.unnecessary, 0);

    return {
      totalBudgeted,
      totalSpent,
      totalNecessary,
      totalUnnecessary,
      categoryBreakdown,
    };
  }, [budget, data, dateHook.year, dateHook.month]);

  // Show skeleton only on initial load
  if (isInitialLoad && loading) {
    return <AnalysisSkeleton />;
  }

  return (
    <div className="content-wrapper">
      <YearMonthFilter
        refreshData={refreshData}
        group={currentGroup}
        dateOptions={dateHook}
        className="self-center text-base"
      />

      <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-start">
        <ChartContainer title="收支類別比例">
          <div className="flex w-full flex-wrap justify-center gap-4">
            <div className="size-75">
              <ExpensePieChart
                totalIncome={chartData.income.total}
                totalOutcome={chartData.outcome.total}
                list={[...chartData.outcome.list, ...chartData.income.list]}
              />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <ExpenseCostTable
                totalIncome={chartData.income.total}
                totalOutcome={chartData.outcome.total}
                incomeList={chartData.income.list}
                outcomeList={chartData.outcome.list}
              />
            </div>
          </div>
        </ChartContainer>

        <ChartContainer title="支出類別比例（必要 vs 額外）">
          <div className="flex w-full flex-wrap justify-center gap-4">
            <div className="size-75">
              <NecessityPieChart
                totalNecessity={chartData.outcome.necessary}
                totalUnnecessity={chartData.outcome.unnecessary}
                list={[
                  ...chartData.outcome.necessaryList,
                  ...chartData.outcome.unnecessaryList,
                ]}
              />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <NecessityCostTable
                totalNecessary={chartData.outcome.necessary}
                totalUnnecessary={chartData.outcome.unnecessary}
                necessaryList={chartData.outcome.necessaryList}
                unnecessaryList={chartData.outcome.unnecessaryList}
              />
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Budget Analysis Section */}
      {budgetAnalysis.totalBudgeted > 0 && (
        <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-start">
          <ChartContainer title="預算使用情況與合理性分析">
            <div className="flex w-full flex-wrap justify-center gap-4">
              <div className="size-75">
                <BudgetPieChart
                  totalBudgeted={budgetAnalysis.totalBudgeted}
                  totalSpent={budgetAnalysis.totalSpent}
                  totalNecessary={budgetAnalysis.totalNecessary}
                  totalUnnecessary={budgetAnalysis.totalUnnecessary}
                  categoryList={[]}
                />
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <BudgetCostTable
                  totalBudgeted={budgetAnalysis.totalBudgeted}
                  totalSpent={budgetAnalysis.totalSpent}
                  totalNecessary={budgetAnalysis.totalNecessary}
                  totalUnnecessary={budgetAnalysis.totalUnnecessary}
                  categoryBreakdown={budgetAnalysis.categoryBreakdown}
                />
              </div>
            </div>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};
