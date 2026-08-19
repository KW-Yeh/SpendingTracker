'use client';

import { MonthlySpendingProgressCard } from '@/app/transactions/MonthlySpendingProgressCard';
import Overview from '@/app/transactions/Overview';
import { BookIcon } from '@/components/icons/BookIcon';
import { CaretDown } from '@/components/icons/CaretDown';
import { RecentTransactionsList } from '@/components/RecentTransactionsList';
import { PageControlBar } from '@/composites/PageControlBar';
import Link from 'next/link';
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
      <PageControlBar
        refreshData={getNewData}
        group={currentGroup}
        dateOptions={dateHook}
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
        <RecentTransactionsList
          data={monthlyData}
          loading={loading}
          refreshData={refreshData}
        />
      </div>

      <GroupManagementLink group={currentGroup} />
    </div>
  );
};

/**
 * 帳目／分析／預算都在 BottomNav，帳本管理沒有入口 —
 * 這條列取代原本四格純導覽卡。
 */
const GroupManagementLink = ({ group }: { group: Group }) => (
  <Link
    href="/group"
    className="flex w-full items-center gap-3 rounded-[18px] border border-black/[0.08] bg-gray-950 px-5 py-3.5 transition-colors hover:bg-gray-900 md:min-w-110"
  >
    <span className="bg-primary-50 text-primary-500 flex size-9 shrink-0 items-center justify-center rounded-[10px]">
      <BookIcon className="size-5" />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span
        className="text-[15px] font-semibold text-gray-100"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        帳本管理
      </span>
      <span className="overflow-hidden text-xs font-medium text-ellipsis whitespace-nowrap text-gray-400">
        {group.name}
        {group.member_count ? ` · ${group.member_count} 位成員` : ''}
      </span>
    </span>
    <CaretDown className="size-3 shrink-0 -rotate-90 text-gray-600" />
  </Link>
);
