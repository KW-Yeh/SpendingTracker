'use client';

import { OverView } from '@/app/insert/OverView';
import { SpendingList } from '@/app/insert/SpendingList';
import { DatePicker } from '@/components/DatePicker';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { GroupSelector } from '@/composites/GroupSelector';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useDate } from '@/hooks/useDate';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { DateFilter, Necessity } from '@/utils/constants';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import dynamic from 'next/dynamic';
import {
  ChangeEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
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
  const [isProcessing, setIsProcessing] = useState(true);
  const [date, setDate] = useDate(new Date());
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string>();
  const [filter, setFilter] = useState(DateFilter.Day);
  const [filteredData, setFilteredData] = useState<SpendingRecord[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOutcome, setTotalOutcome] = useState(0);
  const [necessaryOutcome, setNecessaryOutcome] = useState(0);
  const [filterStr, setFilterStr] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredBySearch = useMemo(
    () =>
      filteredData.filter(
        (d) => filterStr === '' || d.description.includes(filterStr),
      ),
    [filteredData, filterStr],
  );

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
            selectedGroup || undefined,
            userData?.email,
            startDate.toISOString(),
            endDate.toISOString(),
          );
        }
        return newDate;
      });
    },
    [selectedGroup, setDate, syncData, userData?.email],
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
      if (loading || !selectedMemberEmail) return;
      const dataFilterByUser = [...data].filter((_data) =>
        checkUser(_data, selectedMemberEmail),
      );
      const { totalIncome: _totalIncome, totalOutcome: _totalOutcome } =
        getExpenseFromData(dataFilterByUser);
      setTotalIncome(_totalIncome);
      setTotalOutcome(_totalOutcome);
      const dataFilterByNecessary = dataFilterByUser.filter((_data) => {
        return _data.necessity === Necessity.Need;
      });
      setNecessaryOutcome(
        getExpenseFromData(dataFilterByNecessary).totalOutcome,
      );

      const dataFilterByDate = dataFilterByUser.filter((_data) =>
        checkDate(_data.date, date, filter),
      );
      setFilteredData(dataFilterByDate);
      startTransition(() => {
        setIsProcessing(false);
      });
    });
  }, [data, date, selectedMemberEmail, filter, loading]);

  useEffect(() => {
    if (!selectedGroup && userData?.email) {
      setSelectedMemberEmail(userData.email);
    }
  }, [selectedGroup, userData?.email]);

  useEffect(() => {
    const elem = searchRef.current;
    const handleOnChangeSearch = () => {
      setFilterStr(elem?.value || '');
    };
    elem?.addEventListener('change', handleOnChangeSearch);
    return () => elem?.removeEventListener('change', handleOnChangeSearch);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-175 flex-1 flex-col items-center p-6">
      <div className="mb-5 flex w-full justify-end">
        <div className="w-fit">
          <GroupSelector
            selectedGroup={selectedGroup}
            selectedMemberEmail={selectedMemberEmail}
            onSelectGroup={(_groupId) => {
              setSelectedGroup(_groupId);
              refreshData(_groupId);
            }}
            onSelectMemberEmail={setSelectedMemberEmail}
          />
        </div>
      </div>
      <div className="mb-4 flex w-full items-center justify-center">
        <DatePicker
          date={date}
          labelClassName="p-4 text-lg sm:text-xl bg-background font-semibold"
          onChange={handleOnChangeDate}
        />
      </div>

      <OverView
        totalIncome={totalIncome}
        totalOutcome={totalOutcome}
        necessaryOutcome={necessaryOutcome}
        dateStr={date.toISOString()}
      />

      <span className="my-5 w-full"></span>

      <div className="bg-background flex w-full flex-col rounded-3xl border border-solid border-gray-300 p-6 shadow">
        <div className="mb-6 flex items-center gap-4">
          <h3 className="text-lg font-bold">活動</h3>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFilter(DateFilter.Day)}
              className={`rounded-md border border-solid border-gray-300 px-4 py-1 transition-colors ${filter === DateFilter.Day ? 'bg-gray-300' : 'bg-background active:bg-gray-100 sm:hover:bg-gray-100'}`}
            >
              日
            </button>
            <button
              type="button"
              onClick={() => setFilter(DateFilter.Month)}
              className={`rounded-md border border-solid border-gray-300 px-4 py-1 transition-colors ${filter === DateFilter.Month ? 'bg-gray-300' : 'bg-background active:bg-gray-100 sm:hover:bg-gray-100'}`}
            >
              月
            </button>
          </div>
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
          data={filteredBySearch}
          loading={isProcessing}
          refreshData={refreshData}
        />
      </div>

      <AddExpenseBtn autoClick={!!quickInsert}>
        <span className="text-base font-bold">記帳</span>
      </AddExpenseBtn>
    </div>
  );
};

function checkUser(_data: SpendingRecord, email?: string) {
  return email === '' || _data['user-token'] === email;
}

function checkDate(dateStr: string, _date: Date, _filter: DateFilter) {
  const dataDate = new Date(dateStr);
  if (_filter === DateFilter.Month) {
    return (
      dataDate.getFullYear() === _date.getFullYear() &&
      dataDate.getMonth() === _date.getMonth()
    );
  }
  return (
    dataDate.getFullYear() === _date.getFullYear() &&
    dataDate.getMonth() === _date.getMonth() &&
    dataDate.getDate() === _date.getDate()
  );
}
