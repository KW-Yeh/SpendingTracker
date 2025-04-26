'use client';

import { OverView } from '@/app/insert/OverView';
import { SpendingList } from '@/app/insert/SpendingList';
import { DatePicker } from '@/components/DatePicker';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useDate } from '@/hooks/useDate';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import dynamic from 'next/dynamic';
import {
  ChangeEvent,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

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
  const [date, setDate] = useDate(new Date());
  const [monthlyData, setMonthlyData] = useState<SpendingRecord[]>([]);
  const [filterStr, setFilterStr] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleOnChangeDate = useCallback(
    (event: ChangeEvent) => {
      const newDate = new Date((event.target as HTMLInputElement).value);
      setDate((prevDate) => {
        if (
          prevDate.getFullYear() !== newDate.getFullYear() ||
          prevDate.getMonth() !== newDate.getMonth()
        ) {
          const { startDate, endDate } = getStartEndOfMonth(newDate);
          syncData(
            currentGroup?.id,
            userData?.email,
            startDate.toISOString(),
            endDate.toISOString(),
          );
        }
        return newDate;
      });
    },
    [currentGroup?.id, setDate, syncData, userData?.email],
  );

  const refreshData = useCallback(
    (_groupId?: string) => {
      const { startDate, endDate } = getStartEndOfMonth(date);
      syncData(
        _groupId || undefined,
        userData?.email,
        startDate.toISOString(),
        endDate.toISOString(),
      );
    },
    [syncData, userData?.email, date],
  );

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
  }, [data, date, userData?.email, loading]);

  useEffect(() => {
    const elem = searchRef.current;
    const handleOnChangeSearch = () => {
      setFilterStr(elem?.value || '');
    };
    elem?.addEventListener('change', handleOnChangeSearch);
    return () => elem?.removeEventListener('change', handleOnChangeSearch);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-175 flex-1 flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-center">
        <DatePicker
          date={date}
          labelClassName="p-4 text-lg sm:text-xl bg-background font-semibold"
          onChange={handleOnChangeDate}
        />
      </div>

      <AddExpenseBtn autoClick={!!quickInsert}>
        <span className="text-base font-bold">馬上記帳</span>
      </AddExpenseBtn>

      <OverView dateStr={date.toISOString()} costList={monthlyData} />

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
