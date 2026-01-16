'use client';

import { SpendingList } from '@/app/transactions/SpendingList';
import { YearMonthFilter } from '@/app/analysis/YearMonthFilter';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { Select } from '@/components/Select';
import { TransactionsSkeleton } from '@/components/skeletons/TransactionsSkeleton';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useYearMonth } from '@/hooks/useYearMonth';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const SORT_BY: Record<string, string> = {
  date: "日期",
  category: "類別",
  type: "收支",
}

export const SpendingInfoSection = () => {
  useScrollToTop();
  const { syncData, data, loading, isInitialLoad } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const [isProcessing, setIsProcessing] = useState(true);
  const [monthlyData, setMonthlyData] = useState<SpendingRecord[]>([]);
  const [filterStr, setFilterStr] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const searchRef = useRef<HTMLInputElement>(null);
  const dateHook = useYearMonth(new Date());

  const refreshData = useCallback(() => {
    const { startDate, endDate } = getStartEndOfMonth(
      new Date(Number(dateHook.year), Number(dateHook.month) - 1),
    );
    syncData(
      currentGroup?.account_id ? String(currentGroup.account_id) : undefined,
      undefined, // 不傳 email，查詢帳本所有交易
      startDate.toISOString(),
      endDate.toISOString(),
    );
  }, [syncData, dateHook.year, dateHook.month, currentGroup?.account_id]);

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

  useEffect(() => {
    if (loading) return;
    startTransition(() => {
      // 不過濾用戶，顯示帳本內所有交易
      setMonthlyData([...data]);
      setIsProcessing(false);
    });
  }, [data, loading]);

  useEffect(() => {
    const elem = searchRef.current;
    const handleOnChangeSearch = () => {
      setFilterStr(elem?.value || '');
    };
    elem?.addEventListener('change', handleOnChangeSearch);
    return () => elem?.removeEventListener('change', handleOnChangeSearch);
  }, []);

  useEffect(() => {
    const { startDate, endDate } = getStartEndOfMonth(
      new Date(Number(dateHook.year), Number(dateHook.month) - 1),
    );
    syncData(
      currentGroup?.account_id ? String(currentGroup.account_id) : undefined,
      undefined, // 不傳 email，查詢帳本所有交易
      startDate.toISOString(),
      endDate.toISOString(),
    );
  }, [
    currentGroup?.account_id,
    dateHook.month,
    dateHook.year,
    syncData,
  ]);

  // Show skeleton only on initial load
  if (isInitialLoad && loading) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="content-wrapper">
      <YearMonthFilter
        refreshData={getNewData}
        group={currentGroup}
        dateOptions={dateHook}
        className="self-center text-base"
      />

      <div className="ml-auto flex items-center gap-3">
        <Select
          value={SORT_BY[sortBy]}
          name="sortBy"
          onChange={setSortBy}
          className="bg-background rounded-lg border border-solid border-gray-300 px-3 py-1.5 text-sm font-medium transition-all hover:border-primary-400"
        >
          <Select.Item value="date">日期</Select.Item>
          <Select.Item value="category">類別</Select.Item>
          <Select.Item value="type">收支</Select.Item>
        </Select>
        <div className="group hover:border-primary-400 focus-within:border-primary-500 relative flex items-center gap-2 rounded-lg border border-solid border-gray-300 px-3 py-1.5 transition-all focus-within:shadow-sm bg-background">
          <SearchIcon className="group-hover:text-primary-500 group-focus-within:text-primary-500 text-gray-300 transition-colors" />
          <input
            ref={searchRef}
            type="text"
            placeholder="搜尋帳目..."
            className="w-32 bg-transparent py-0.5 text-sm font-medium focus:outline-0"
          />
        </div>
      </div>

      <div className="bg-background w-full rounded-2xl border border-solid border-gray-200 p-5 shadow-sm transition-shadow duration-200 hover:shadow">
        <SpendingList
          data={monthlyData}
          filterStr={filterStr}
          sortBy={sortBy}
          loading={isProcessing}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
};
