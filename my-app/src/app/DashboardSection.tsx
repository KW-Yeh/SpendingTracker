'use client';

import { MiniDailyCostChart } from '@/app/home/MiniDailyCostChart';
import Overview from '@/app/home/Overview';
import { QuickNavigationCards } from '@/components/QuickNavigationCards';
import { RecentTransactionsList } from '@/components/RecentTransactionsList';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { startTransition, useEffect, useState } from 'react';

export const DashboardSection = ({ isMobile }: { isMobile: boolean }) => {
  const { config: userData } = useUserConfigCtx();
  const { syncData, data, loading } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const [monthlyData, setMonthlyData] = useState<SpendingRecord[]>([]);

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
    <div className="content-wrapper max-w-6xl">
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

      <div className="flex w-full flex-col gap-5 md:flex-row">
        <QuickNavigationCards isMobile={isMobile} />
        <RecentTransactionsList data={monthlyData} loading={loading} />
      </div>
    </div>
  );
};
