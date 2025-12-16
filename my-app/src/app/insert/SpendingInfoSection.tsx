'use client';

import { DailyCostChart } from '@/app/insert/DailyCostChart';
import OverView from '@/app/insert/Overview';
import { SpendingList } from '@/app/insert/SpendingList';
import { YearMonthFilter } from '@/app/list/YearMonthFilter';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
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
  const { config: userData } = useUserConfigCtx();
  const { syncData, data, loading } = useGetSpendingCtx();
  const { currentGroup } = useGroupCtx();
  const [isProcessing, setIsProcessing] = useState(true);
  const [monthlyData, setMonthlyData] = useState<SpendingRecord[]>([]);
  const [filterStr, setFilterStr] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const dateHook = useYearMonth(new Date());

  const refreshData = useCallback(
    (_groupId?: string) => {
      const { startDate, endDate } = getStartEndOfMonth(
        new Date(Number(dateHook.year), Number(dateHook.month) - 1),
      );
      syncData(
        _groupId || undefined,
        userData?.email,
        startDate.toISOString(),
        endDate.toISOString(),
      );
    },
    [syncData, userData?.email, dateHook.year, dateHook.month],
  );

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

  const handleSelectDataPoint = (state: CategoricalChartState) => {
    if (!state.activePayload || !state.activePayload[0]) return;
    const selectedLabel = state.activePayload[0].payload.date;
    if (!selectedLabel) return;
    const element = document.getElementById(`spending-list-${selectedLabel}`);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.style.borderColor = '#fff085';
    setTimeout(() => {
      element.style.borderColor = 'transparent';
    }, 2000);
  };

  useEffect(() => {
    startTransition(() => {
      if (loading || !userData?.email) return;
      const dataFilterByUser = [...data].filter((_data) =>
        checkUser(_data, userData.email),
      );
      setMonthlyData(dataFilterByUser);
      startTransition(() => {
        setIsProcessing(false);
      });
    });
  }, [data, userData?.email, loading]);

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
      userData?.email,
      startDate.toISOString(),
      endDate.toISOString(),
    );
  }, [
    currentGroup?.account_id,
    dateHook.month,
    dateHook.year,
    syncData,
    userData?.email,
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
        <div className="flex w-full max-w-175 flex-col items-center gap-5">
          <OverView
            budgets={userData?.budget}
            costList={data}
            isMobile={isMobile}
          />
          <DailyCostChart
            dateStr={dateHook.today.toISOString()}
            costList={data}
            isMobile={isMobile}
            handleSelectDataPoint={handleSelectDataPoint}
          />
        </div>

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

function checkUser(_data: SpendingRecord, email?: string) {
  return email === '' || _data['user-token'] === email;
}
