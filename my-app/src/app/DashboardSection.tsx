'use client';

import { MonthlySpendingProgressCard } from '@/app/transactions/MonthlySpendingProgressCard';
import Overview from '@/app/transactions/Overview';
import { QuickNavigationCards } from '@/components/QuickNavigationCards';
import { RecentTransactionsList } from '@/components/RecentTransactionsList';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { NoGroupEmptyState } from '@/components/NoGroupEmptyState';
import { useBudgetCtx } from '@/context/BudgetProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import {
  startTransition,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { YearMonthFilter } from './analysis/YearMonthFilter';
import { useYearMonth } from '@/hooks/useYearMonth';

export const DashboardSection = ({ isMobile }: { isMobile: boolean }) => {
  const { syncData, data, loading, hasEverLoaded } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const { budget } = useBudgetCtx();
  const [monthlyData, setMonthlyData] = useState<SpendingRecord[]>([]);
  const dateHook = useYearMonth(new Date());

  const refreshData = useCallback(() => {
    const now = new Date();
    const { startDate, endDate } = getStartEndOfMonth(now);
    syncData(
      currentGroup?.account_id ? String(currentGroup.account_id) : undefined,
      undefined, // 不傳 email，查詢帳本所有交易
      startDate.toISOString(),
      endDate.toISOString(),
    );
  }, [currentGroup?.account_id, syncData]);

  const getNewData = useCallback(
    (_groupId: string | undefined, year: string, month: string) => {
      const { startDate, endDate } = getStartEndOfMonth(
        new Date(Number(year), Number(month) - 1),
      );
      syncData(
        _groupId || undefined,
        undefined, // 不傳 email，查詢帳本所有交易
        startDate.toISOString(),
        endDate.toISOString(),
      );
    },
    [syncData],
  );

  // Auto-sync current month data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // 不過濾用戶，顯示帳本內所有交易 - Use startTransition for non-blocking updates
  useEffect(() => {
    startTransition(() => {
      setMonthlyData([...data]);
    });
  }, [data]);

  // Calculate current month's budget total
  const currentMonthBudget = useMemo(() => {
    if (!budget?.monthly_items) return 0;

    const selectedMonth = Number(dateHook.month);
    let total = 0;

    budget.monthly_items.forEach((item) => {
      const monthAmount = item.months?.[selectedMonth.toString()];
      if (monthAmount) {
        total += monthAmount;
      }
    });

    return total;
  }, [budget, dateHook.month]);

  // Only show the skeleton when we genuinely have nothing to render yet.
  if (!hasEverLoaded && data.length === 0) {
    return <DashboardSkeleton />;
  }

  if (!currentGroup) {
    return <NoGroupEmptyState>{null}</NoGroupEmptyState>;
  }

  return (
    <div className="content-wrapper">
      <YearMonthFilter
        refreshData={getNewData}
        group={currentGroup}
        dateOptions={dateHook}
        className="self-center text-base"
      />

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-start md:gap-5">
        <Overview
          monthlyBudget={currentMonthBudget}
          budget={budget}
          costList={monthlyData}
          isMobile={isMobile}
          selectedMonth={Number(dateHook.month)}
        />

        <MonthlySpendingProgressCard
          year={Number(dateHook.year)}
          month={Number(dateHook.month)}
          costList={monthlyData}
          monthlyBudget={currentMonthBudget}
          isMobile={isMobile}
        />
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-5">
        <QuickNavigationCards isMobile={isMobile} />
        <RecentTransactionsList
          data={monthlyData}
          loading={loading}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
};
