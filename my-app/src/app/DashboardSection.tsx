'use client';

import { MiniDailyCostChart } from '@/app/transactions/MiniDailyCostChart';
import Overview from '@/app/transactions/Overview';
import { QuickNavigationCards } from '@/components/QuickNavigationCards';
import { RecentTransactionsList } from '@/components/RecentTransactionsList';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { YearMonthFilter } from './analysis/YearMonthFilter';
import { useYearMonth } from '@/hooks/useYearMonth';

export const DashboardSection = ({ isMobile }: { isMobile: boolean }) => {
  const { budgetData } = useUserConfigCtx();
  const { syncData, data, loading } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
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

  // 不過濾用戶，顯示帳本內所有交易
  useEffect(() => {
    startTransition(() => {
      if (loading) return;
      setMonthlyData([...data]);
    });
  }, [data, loading]);

  return (
    <div className="content-wrapper">
      <YearMonthFilter
        refreshData={getNewData}
        group={currentGroup}
        dateOptions={dateHook}
        className="flex justify-center rounded-lg border border-gray-200 bg-white p-2 text-base shadow-sm"
      />

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-5">
        <Overview
          budgets={budgetData.budget}
          costList={monthlyData}
          isMobile={isMobile}
        />

        <MiniDailyCostChart
          dateStr={new Date().toISOString()}
          costList={monthlyData}
          isMobile={isMobile}
        />
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-5">
        <QuickNavigationCards isMobile={isMobile} />
        <RecentTransactionsList data={monthlyData} loading={loading} refreshData={refreshData} />
      </div>
    </div>
  );
};
