'use client';

import { SpendingItem } from '@/app/transactions/SpendingItem';
import { DoubleArrowIcon } from '@/components/icons/DoubleArrowIcon';
import Link from 'next/link';
import { useMemo } from 'react';

interface Props {
  data: SpendingRecord[];
  loading: boolean;
  refreshData?: () => void;
}

export const RecentTransactionsList = ({ data, loading, refreshData }: Props) => {
  const recentData = useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [data]);

  // Only show loading skeleton if we have no data yet
  if (loading && data.length === 0) {
    return (
      <div className="bg-background flex w-full flex-col rounded-2xl border border-gray-200 p-5 shadow-sm md:min-w-110">
        <h3 className="mb-4 text-lg font-bold">最近 5 筆交易</h3>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 w-full animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex w-full flex-col rounded-2xl border border-gray-200 p-5 shadow-sm md:min-w-110">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">最近 5 筆交易</h3>
        <Link
          href="/transactions"
          className="text-primary-500 hover:text-primary-400 active:text-primary-600 flex items-center gap-1 text-xs font-bold transition-colors"
        >
          查看更多
          <DoubleArrowIcon className="size-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {recentData.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">尚無交易記錄</p>
        ) : (
          recentData.map((spending, index) => (
            <SpendingItem
              key={`${spending.id}-${index}`}
              spending={spending}
              refreshData={refreshData || (() => {})}
            />
          ))
        )}
      </div>
    </div>
  );
};
