'use client';

import { CategoryAccordion } from '@/app/insert/CategoryAccordion';
import { OverView } from '@/app/insert/OverView';
import { SpendingList } from '@/app/insert/SpendingList';
import { DatePicker } from '@/components/DatePicker';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { GroupSelector } from '@/composites/GroupSelector';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useDate } from '@/hooks/useDate';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import {
  DateFilter,
  INCOME_TYPE_MAP,
  OUTCOME_TYPE_MAP,
} from '@/utils/constants';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import dynamic from 'next/dynamic';
import {
  ChangeEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
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
  const { syncData, loading, data } = useGetSpendingCtx();
  const [date, setDate] = useDate(new Date());
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string>();
  const [filter, setFilter] = useState(DateFilter.Day);
  const [filteredData, setFilteredData] = useState<SpendingRecord[]>([]);
  const [totalIncome, setTotalIncome] = useState(100);
  const [totalOutcome, setTotalOutcome] = useState(50);

  const month = useMemo(() => date.getMonth(), [date]);

  const usage = useMemo(() => {
    return getExpenseFromData(
      [...data].filter(
        (data) =>
          checkUser(data, selectedMemberEmail) &&
          new Date(data.date).getFullYear() === date.getFullYear() &&
          new Date(data.date).getMonth() === date.getMonth(),
      ),
    ).totalOutcome;
  }, [filter, data, selectedMemberEmail, date]);

  const budget = useMemo(() => {
    if (!userData?.budgetList) return undefined;
    return userData.budgetList[month];
  }, [filter, month, userData?.budgetList]);

  const handleOnChangeDate = useCallback(
    (event: ChangeEvent) => {
      const newDate = new Date((event.target as HTMLInputElement).value);
      setDate((prevDate) => {
        if (
          prevDate.getFullYear() !== newDate.getFullYear() ||
          prevDate.getMonth() !== newDate.getMonth()
        ) {
          syncData(
            selectedGroup || undefined,
            userData?.email,
            newDate.toUTCString(),
          );
        }
        return newDate;
      });
    },
    [selectedGroup, setDate, syncData, userData?.email],
  );

  const refreshData = useCallback(
    (_groupId?: string) => {
      syncData(_groupId || undefined, userData?.email, date.toUTCString());
    },
    [syncData, userData?.email, date],
  );

  useEffect(() => {
    startTransition(() => {
      const _filteredData = [...data].filter(
        (data) =>
          checkUser(data, selectedMemberEmail) &&
          checkDate(data.date, date, filter),
      );
      const { totalIncome: _totalIncome, totalOutcome: _totalOutcome } =
        getExpenseFromData(_filteredData);
      setTotalIncome(_totalIncome);
      setTotalOutcome(_totalOutcome);
      setFilteredData(_filteredData);
    });
  }, [checkDate, checkUser, data, date, selectedMemberEmail, filter]);

  useEffect(() => {
    if (!selectedGroup && userData?.email) {
      setSelectedMemberEmail(userData.email);
    }
  }, [selectedGroup, userData?.email]);

  return (
    <div className="relative flex w-full flex-1 flex-col items-center gap-4 p-6">
      <div className="absolute right-6 top-6">
        <button
          type="button"
          onClick={() => refreshData()}
          disabled={loading}
          className="rounded-md bg-gray-200 p-2 transition-colors active:bg-gray-300 sm:hover:bg-gray-300"
        >
          <RefreshIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="flex w-full max-w-175 items-center gap-2">
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
      <div className="flex w-full justify-center">
        <DatePicker
          date={date}
          labelClassName="p-4 text-base sm:text-lg bg-background"
          onChange={handleOnChangeDate}
        />
      </div>
      <div className="flex w-full flex-col gap-1 sm:max-w-96">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center divide-x divide-gray-300 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => {
                setDate(
                  filter === DateFilter.Day
                    ? getDateByOffsetDay(date, -1)
                    : getDateByOffsetMonth(date, -1),
                );
              }}
              className="px-2 py-1 text-center text-primary-700 transition-colors active:text-primary-300 sm:hover:text-primary-300"
            >
              {filter === DateFilter.Day ? '昨天' : '上個月'}
            </button>
            <button
              type="button"
              onClick={() => {
                setDate(
                  filter === DateFilter.Day
                    ? getDateByOffsetDay(date, 1)
                    : getDateByOffsetMonth(date, 1),
                );
              }}
              className="px-2 py-1 text-center text-primary-700 transition-colors active:text-primary-300 sm:hover:text-primary-300"
            >
              {filter === DateFilter.Day ? '明天' : '下個月'}
            </button>
          </div>
          <div className="flex items-center divide-x divide-gray-300 rounded border border-solid border-gray-300 text-sm">
            <button
              type="button"
              onClick={() => setFilter(DateFilter.Day)}
              className={`rounded-l-[3px] px-4 py-1 transition-colors ${filter === DateFilter.Day ? 'bg-gray-300' : 'bg-background'}`}
            >
              日
            </button>
            <button
              type="button"
              onClick={() => setFilter(DateFilter.Month)}
              className={`rounded-r-[3px] px-4 py-1 transition-colors ${filter === DateFilter.Month ? 'bg-gray-300' : 'bg-background'}`}
            >
              月
            </button>
          </div>
        </div>
        <OverView
          totalIncome={totalIncome}
          totalOutcome={totalOutcome}
          budget={budget}
          usage={usage}
          filter={filter}
          dateStr={date.toUTCString()}
        />
      </div>
      <div className="flex w-full max-w-175 flex-col gap-2 pb-20">
        <CategoryAccordion
          title="支出"
          data={filteredData}
          categoryMap={OUTCOME_TYPE_MAP}
        >
          {(categoryData) => (
            <SpendingList
              data={categoryData}
              loading={loading}
              refreshData={refreshData}
            />
          )}
        </CategoryAccordion>
        <CategoryAccordion
          title="收入"
          data={filteredData}
          categoryMap={INCOME_TYPE_MAP}
        >
          {(categoryData) => (
            <SpendingList
              data={categoryData}
              loading={loading}
              refreshData={refreshData}
            />
          )}
        </CategoryAccordion>
      </div>

      <AddExpenseBtn
        borderStyle="conic-gradient-from-purple-to-red"
        autoClick={!!quickInsert}
      >
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

function getDateByOffsetMonth(date: Date, offset: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + offset);
  return newDate;
}

function getDateByOffsetDay(date: Date, offset: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + offset);
  return newDate;
}
