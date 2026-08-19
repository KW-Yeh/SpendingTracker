'use client';

import { SpendingList } from '@/app/transactions/SpendingList';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { TransactionsSkeleton } from '@/components/skeletons/TransactionsSkeleton';
import { NoGroupEmptyState } from '@/components/NoGroupEmptyState';
import { PageControlBar } from '@/composites/PageControlBar';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useYearMonth } from '@/hooks/useYearMonth';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { normalizeNumber } from '@/utils/normalizeNumber';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const SORT_OPTIONS = [
  { value: 'date', label: '日期' },
  { value: 'category', label: '類別' },
  { value: 'type', label: '收支' },
];

export const SpendingInfoSection = () => {
  useScrollToTop();
  const { syncData, data, loading, hasEverLoaded } = useGetSpendingCtx();
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
    elem?.addEventListener('input', handleOnChangeSearch);
    return () => elem?.removeEventListener('input', handleOnChangeSearch);
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
  }, [currentGroup?.account_id, dateHook.month, dateHook.year, syncData]);

  const { totalOutcome } = useMemo(
    () => getExpenseFromData(monthlyData),
    [monthlyData],
  );

  // Only show the skeleton when we genuinely have nothing to render yet.
  if (!hasEverLoaded && data.length === 0) {
    return <TransactionsSkeleton />;
  }

  if (!currentGroup) {
    return <NoGroupEmptyState>{null}</NoGroupEmptyState>;
  }

  return (
    <div className="content-wrapper !items-stretch">
      <PageControlBar
        refreshData={getNewData}
        group={currentGroup}
        dateOptions={dateHook}
      />

      <div className="flex items-end justify-between gap-3 pt-1">
        <h1
          className="font-semibold text-gray-100"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '28px',
            letterSpacing: '-0.015em',
          }}
        >
          帳目
        </h1>
        <span
          className="text-xs font-semibold text-gray-400"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {monthlyData.length} 筆 · 支出 ${normalizeNumber(totalOutcome)}
        </span>
      </div>

      <div className="group hover:border-primary-400 focus-within:border-primary-500 bg-background flex h-10 items-center gap-2 rounded-xl border border-solid border-black/[0.08] px-3 transition-colors">
        <SearchIcon className="group-focus-within:text-primary-500 size-[17px] shrink-0 text-gray-400 transition-colors" />
        <input
          ref={searchRef}
          type="text"
          placeholder="搜尋帳目描述…"
          className="w-full bg-transparent text-sm font-medium focus:outline-0"
        />
      </div>

      <div className="flex self-start rounded-full border border-black/[0.08] bg-black/[0.04] p-0.5">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSortBy(option.value)}
            aria-pressed={sortBy === option.value}
            className={`h-8 rounded-full px-3 text-xs font-semibold transition-colors ${
              sortBy === option.value
                ? 'bg-gray-950 text-gray-100 shadow-sm'
                : 'hover:text-primary-500 text-gray-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <SpendingList
        data={monthlyData}
        filterStr={filterStr}
        sortBy={sortBy}
        loading={isProcessing}
        refreshData={refreshData}
      />
    </div>
  );
};
