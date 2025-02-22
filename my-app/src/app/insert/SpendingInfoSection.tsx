'use client';

import { AddExpenseBtn } from '@/app/insert/AddExpenseBtn';
import { CategoryAccordion } from '@/app/insert/CategoryAccordion';
import { OverView } from '@/app/insert/OverView';
import { SpendingList } from '@/app/insert/SpendingList';
import { DatePicker } from '@/components/DatePicker';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { GroupSelector } from '@/composites/GroupSelector';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useDate } from '@/hooks/useDate';
import {
  DateFilter,
  INCOME_TYPE_MAP,
  OUTCOME_TYPE_MAP,
} from '@/utils/constants';
import { getExpenseFromData } from '@/utils/getExpenseFromData';
import {
  ChangeEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const SpendingInfoSection = ({
  quickInsert,
}: {
  quickInsert?: string;
}) => {
  const { config: userData } = useUserConfigCtx();
  const { syncData, loading, data } = useGetSpendingCtx();
  const { syncGroup } = useGroupCtx();
  const [date, setDate] = useDate(new Date());
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string>();
  const [filter, setFilter] = useState(DateFilter.Day);
  const [filteredData, setFilteredData] = useState<SpendingRecord[]>([]);

  const expenseInfo = useMemo(
    () => getExpenseFromData(filteredData),
    [filteredData],
  );

  const year = useMemo(() => date.getFullYear(), [date]);
  const month = useMemo(() => date.getMonth(), [date]);

  const budget = useMemo(() => {
    if (!userData?.budgetList) return undefined;
    if (filter === DateFilter.Day) {
      const days = new Date(year, month + 1, 0).getDate();
      return Math.floor(userData.budgetList[month] / days);
    } else if (filter === DateFilter.Month) {
      return userData.budgetList[month];
    } else {
      return userData.budgetList.reduce((acc, cur) => acc + cur, 0);
    }
  }, [filter, month, userData?.budgetList, year]);

  const handleOnChangeDate = (event: ChangeEvent) => {
    setDate(new Date((event.target as HTMLInputElement).value));
  };

  const checkDate = useCallback(
    (dateStr: string) => {
      const dataDate = new Date(dateStr);
      if (filter === DateFilter.Year) {
        return dataDate.getFullYear() === date.getFullYear();
      } else if (filter === DateFilter.Month) {
        return (
          dataDate.getFullYear() === date.getFullYear() &&
          dataDate.getMonth() === date.getMonth()
        );
      }
      return (
        dataDate.getFullYear() === date.getFullYear() &&
        dataDate.getMonth() === date.getMonth() &&
        dataDate.getDate() === date.getDate()
      );
    },
    [filter, date],
  );

  const refreshData = useCallback(() => {
    syncData(selectedGroup || undefined, userData?.email, date.toUTCString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, syncData, userData?.email, year, month]);

  useEffect(() => {
    if (selectedGroup === '' && userData?.email) {
      syncData(undefined, userData.email, date.toUTCString());
    } else {
      syncData(selectedGroup, undefined, date.toUTCString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, userData?.email, syncData, year, month]);

  useEffect(() => {
    if (data.length > 0) {
      startTransition(() => {
        setFilteredData(
          [...data].filter(
            (data) =>
              (selectedMemberEmail === '' ||
                data['user-token'] === selectedMemberEmail) &&
              checkDate(data.date),
          ),
        );
      });
    }
  }, [checkDate, data, selectedMemberEmail]);

  useEffect(() => {
    if (!selectedGroup && userData?.email) {
      setSelectedMemberEmail(userData.email);
    }
  }, [selectedGroup, userData?.email]);

  useEffect(() => {
    if (userData?.groups) {
      syncGroup(userData.groups);
    }
  }, [syncGroup, userData?.groups]);

  return (
    <div className="relative flex w-full flex-1 flex-col items-center gap-4 p-6">
      <div className="absolute right-6 top-6">
        <button
          type="button"
          onClick={refreshData}
          disabled={loading}
          className="rounded-md bg-gray-200 p-2 transition-colors active:bg-gray-300 sm:hover:bg-gray-300"
        >
          <RefreshIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="flex w-full max-w-175 items-center gap-2">
        <div className="">
          <GroupSelector
            selectedGroup={selectedGroup}
            selectedMemberEmail={selectedMemberEmail}
            onSelectGroup={setSelectedGroup}
            onSelectMemberEmail={setSelectedMemberEmail}
          />
        </div>
      </div>
      <div className="flex w-full max-w-175 items-center justify-between gap-2 sm:justify-center">
        <DatePicker
          date={date}
          labelClassName="p-4 text-sm sm:text-lg bg-background"
          onChange={handleOnChangeDate}
        />
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
            className={`px-4 py-1 transition-colors ${filter === DateFilter.Month ? 'bg-gray-300' : 'bg-background'}`}
          >
            月
          </button>
          <button
            type="button"
            onClick={() => setFilter(DateFilter.Year)}
            className={`rounded-r-[3px] px-4 py-1 transition-colors ${filter === DateFilter.Year ? 'bg-gray-300' : 'bg-background'}`}
          >
            年
          </button>
        </div>
      </div>
      <OverView
        totalIncome={expenseInfo.totalIncome}
        totalOutcome={expenseInfo.totalOutcome}
        budget={budget}
        usage={expenseInfo.totalOutcome}
        filter={filter}
        dateStr={date.toUTCString()}
      />
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
