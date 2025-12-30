'use client';

import { DailyCostChart } from '@/app/transactions/DailyCostChart';
import OverView from '@/app/transactions/Overview';
import { SpendingList } from '@/app/transactions/SpendingList';
import { YearMonthFilter } from '@/app/analysis/YearMonthFilter';
import { SearchIcon } from '@/components/icons/SearchIcon';
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
import { CategoricalChartState } from 'recharts/types/chart/types';

export const SpendingInfoSection = ({ isMobile }: { isMobile: boolean }) => {
  useScrollToTop();
  const { syncData, data, loading } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const [isProcessing, setIsProcessing] = useState(true);
  const [monthlyData, setMonthlyData] = useState<SpendingRecord[]>([]);
  const [filterStr, setFilterStr] = useState('');
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

  const handleSelectDataPoint = (state: CategoricalChartState) => {
    if (!state.activePayload || !state.activePayload[0]) return;
    const selectedLabel = state.activePayload[0].payload.date;
    if (!selectedLabel) return;
    const element = document.getElementById(`spending-list-${selectedLabel}`);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.add('highlight-pulse');
    setTimeout(() => {
      element.classList.remove('highlight-pulse');
    }, 2000);
  };

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

  return (
    <div className="content-wrapper">
      <YearMonthFilter
        refreshData={getNewData}
        group={currentGroup}
        dateOptions={dateHook}
        className="flex self-center rounded-lg border border-gray-200 bg-white p-2 text-base shadow-sm"
      />

      <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
        <div className="bg-background flex w-full flex-col rounded-2xl border border-solid border-gray-200 p-5 shadow-sm transition-shadow duration-200 hover:shadow">
          <div className="mb-5 flex items-center gap-4">
            <h3 className="text-lg font-bold">帳目</h3>
            <div className="group hover:border-primary-400 focus-within:border-primary-500 relative ml-auto flex items-center gap-2 rounded-lg border border-solid border-gray-300 px-3 py-1.5 transition-all focus-within:shadow-sm">
              <SearchIcon className="group-hover:text-primary-500 group-focus-within:text-primary-500 text-gray-500 transition-colors" />
              <input
                ref={searchRef}
                type="text"
                placeholder="搜尋帳目..."
                className="w-32 bg-transparent py-0.5 text-sm font-medium focus:outline-0"
              />
            </div>
          </div>
          <SpendingList
            data={monthlyData}
            filterStr={filterStr}
            loading={isProcessing}
            refreshData={refreshData}
          />
        </div>
      </div>
    </div>
  );
};
