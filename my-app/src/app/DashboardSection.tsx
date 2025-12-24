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
  const { config: userData } = useUserConfigCtx();
  const { syncData, data, loading } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const [monthlyData, setMonthlyData] = useState<SpendingRecord[]>([]);
  const dateHook = useYearMonth(new Date());

  const getNewData = useCallback(
    (_groupId: string | undefined, year: string, month: string) => {
      const { startDate, endDate } = getStartEndOfMonth(
        new Date(Number(year), Number(month) - 1),
      );
      syncData(
        _groupId || undefined,
        userData?.email,
        startDate.toISOString(),
        endDate.toISOString(),
      );
    },
    [syncData, userData?.email],
  );

  // Auto-sync current month data
  useEffect(() => {
    const now = new Date();
    const { startDate, endDate } = getStartEndOfMonth(now);
    syncData(
      currentGroup?.account_id ? String(currentGroup.account_id) : undefined,
      userData?.email,
      startDate.toISOString(),
      endDate.toISOString(),
    );
  }, [currentGroup?.account_id, userData?.email, syncData]);

  // Filter data by user
  useEffect(() => {
    startTransition(() => {
      if (loading || !userData?.email) return;
      const dataFilterByUser = data.filter(
        (_data) =>
          userData.email === '' || _data['user-token'] === userData.email,
      );
      setMonthlyData(dataFilterByUser);
    });
  }, [data, userData?.email, loading]);

  return (
    <div className="content-wrapper">
      <YearMonthFilter
        refreshData={getNewData}
        group={currentGroup}
        dateOptions={dateHook}
        className="flex w-full max-w-80 justify-center rounded-lg border border-gray-200 bg-white p-2 text-base shadow-sm"
      />

      <div className="flex w-full flex-col gap-5 md:w-auto md:flex-row">
        <Overview
          budgets={userData?.budget}
          costList={monthlyData}
          isMobile={isMobile}
        />

        <MiniDailyCostChart
          dateStr={new Date().toISOString()}
          costList={monthlyData}
          isMobile={isMobile}
        />
      </div>

      <div className="flex w-full flex-col gap-5 md:w-auto md:flex-row">
        <QuickNavigationCards isMobile={isMobile} />
        <RecentTransactionsList data={monthlyData} loading={loading} />
      </div>
    </div>
  );
};
