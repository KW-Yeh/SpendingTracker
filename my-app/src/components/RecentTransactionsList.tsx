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

const CARD_CLASS =
  'flex w-full flex-col rounded-[18px] border border-black/[0.08] bg-gray-950 px-3 pt-5 pb-2 md:min-w-110';

export const RecentTransactionsList = ({
  data,
  loading,
  refreshData,
}: Props) => {
  const recentData = useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [data]);

  // Only show loading skeleton if we have no data yet
  if (loading && data.length === 0) {
    return (
      <div className={CARD_CLASS}>
        <h3
          className="mb-3 px-2 font-semibold text-gray-100"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '17px',
            letterSpacing: '-0.015em',
          }}
        >
          最近交易
        </h3>
        <div className="flex flex-col gap-2 px-2 pb-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-[52px] w-full rounded-[10px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={CARD_CLASS}>
      <div className="mb-1 flex items-center justify-between px-2">
        <h3
          className="font-semibold text-gray-100"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '17px',
            letterSpacing: '-0.015em',
          }}
        >
          最近交易
        </h3>
        <Link
          href="/transactions"
          className="text-primary-500 hover:text-primary-400 active:text-primary-600 flex items-center gap-1 text-xs font-bold transition-colors"
        >
          查看更多
          <DoubleArrowIcon className="size-3" />
        </Link>
      </div>

      <div className="flex flex-col">
        {recentData.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-300">
            尚無交易記錄
          </p>
        ) : (
          recentData.map((spending, index) => (
            <SpendingItem
              key={`${spending.id}-${index}`}
              spending={spending}
              refreshData={refreshData || (() => {})}
              showDate
            />
          ))
        )}
      </div>
    </div>
  );
};
