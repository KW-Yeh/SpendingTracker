'use client';

import { OverView } from '@/app/insert/OverView';
import { SpendingList } from '@/app/insert/SpendingList';
import { YearMonthFilter } from '@/app/list/YearMonthFilter';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useYearMonth } from '@/hooks/useYearMonth';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import dynamic from 'next/dynamic';
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CategoricalChartState } from 'recharts/types/chart/types';

const AddExpenseBtn = dynamic(() => import('@/app/insert/AddExpenseBtn'));

export const SpendingInfoSection = ({
  quickInsert,
}: {
  quickInsert?: string;
}) => {
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
    const selectedLabel = state.activeLabel;
    const element = document.getElementById(`spending-list-${selectedLabel}`);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.style.backgroundColor = '#fff08570';
    setTimeout(() => {
      element.style.backgroundColor = 'transparent';
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
      currentGroup?.id,
      userData?.email,
      startDate.toISOString(),
      endDate.toISOString(),
    );
  }, [
    currentGroup?.id,
    dateHook.month,
    dateHook.year,
    syncData,
    userData?.email,
  ]);

  return (
    <div className="relative mx-auto flex w-full max-w-175 flex-1 flex-col items-center gap-6 p-6">
      <div className="flex self-center">
        <YearMonthFilter
          refreshData={getNewData}
          group={currentGroup}
          dateOptions={dateHook}
        />
      </div>

      <AddExpenseBtn autoClick={!!quickInsert}>立即新增帳目</AddExpenseBtn>

      <OverView
        dateStr={dateHook.today.toISOString()}
        costList={data}
        handleSelectDataPoint={handleSelectDataPoint}
      />

      <div className="bg-background flex w-full flex-col rounded-3xl border border-solid border-gray-300 p-6 shadow">
        <div className="mb-6 flex items-center gap-4">
          <h3 className="text-lg font-bold">帳目</h3>
          <div className="group ml-auto flex items-center gap-2 rounded-lg border border-solid border-gray-300 px-2">
            <SearchIcon className="group-hover:text-primary-500 text-gray-500 transition-colors" />
            <input
              ref={searchRef}
              type="text"
              className="w-20 bg-transparent py-1 text-sm font-semibold focus:outline-0"
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
  );
};

function checkUser(_data: SpendingRecord, email?: string) {
  return email === '' || _data['user-token'] === email;
}
