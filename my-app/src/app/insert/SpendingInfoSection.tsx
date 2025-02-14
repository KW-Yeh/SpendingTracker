'use client';

import { CategoryAccordion } from '@/app/insert/CategoryAccordion';
import { OverView } from '@/app/insert/OverView';
import { SpendingList } from '@/app/insert/SpendingList';
import { DatePicker } from '@/components/DatePicker';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { AddExpenseBtn } from '@/composites/AddExpenseBtn';
import { EditExpenseModal } from '@/composites/EditExpenseModal';
import { GroupSelector } from '@/composites/GroupSelector';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useSpendingReducer } from '@/hooks/useSpendingReducer';
import {
  DateFilter,
  INCOME_TYPE_MAP,
  OUTCOME_TYPE_MAP,
  SpendingType,
} from '@/utils/constants';
import {
  ChangeEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v7 as uuid } from 'uuid';

export const SpendingInfoSection = () => {
  const [state, dispatch] = useSpendingReducer();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string>();
  const { config: userData } = useUserConfigCtx();
  const { syncData, loading, data } = useGetSpendingCtx();
  const { syncGroup } = useGroupCtx();
  const modalRef = useRef<ModalRef>(null);
  const [isNewData, setIsNewData] = useState(false);
  const [filter, setFilter] = useState(DateFilter.Day);
  const [filteredData, setFilteredData] = useState<SpendingRecord[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOutcome, setTotalOutcome] = useState(0);

  const year = useMemo(() => new Date(state.date).getFullYear(), [state.date]);
  const month = useMemo(() => new Date(state.date).getMonth(), [state.date]);

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
    const date = new Date((event.target as HTMLInputElement).value);
    startTransition(() => {
      dispatch({
        type: 'SET_DATE',
        payload: date.toUTCString(),
      });
    });
  };

  const checkDate = useCallback(
    (dateStr: string) => {
      const date = new Date(dateStr);
      const currentDate = new Date(state.date);
      if (filter === DateFilter.Year) {
        return date.getFullYear() === currentDate.getFullYear();
      } else if (filter === DateFilter.Month) {
        return (
          date.getFullYear() === currentDate.getFullYear() &&
          date.getMonth() === currentDate.getMonth()
        );
      }
      return (
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getDate() === currentDate.getDate()
      );
    },
    [filter, state.date],
  );

  const refreshData = useCallback(() => {
    syncData(selectedGroup || undefined, userData?.email, state.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, syncData, userData?.email, year]);

  useEffect(() => {
    if (selectedGroup === '' && userData) {
      syncData(undefined, userData.email, state.date);
    } else {
      syncData(selectedGroup, undefined, state.date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, userData, syncData, year]);

  useEffect(() => {
    let _totalIncome = 0;
    let _totalOutcome = 0;
    filteredData.forEach((item) => {
      if (item.type === SpendingType.Income) {
        _totalIncome += item.amount;
      } else {
        _totalOutcome += item.amount;
      }
    });
    setTotalIncome(_totalIncome);
    setTotalOutcome(_totalOutcome);
  }, [filteredData]);

  useEffect(() => {
    if (data.length > 0) {
      setFilteredData(
        [...data].filter(
          (data) =>
            (selectedMemberEmail === '' ||
              data['user-token'] === selectedMemberEmail) &&
            checkDate(data.date),
        ),
      );
    }
  }, [checkDate, data, selectedMemberEmail]);

  const reset = () => {
    dispatch({
      type: 'RESET',
      payload: {
        id: uuid(),
        date: new Date().toUTCString(),
        amount: 0,
        description: '',
      },
    });
  };

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
          date={new Date(state.date)}
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
        totalIncome={totalIncome}
        totalOutcome={totalOutcome}
        budget={budget}
        usage={totalOutcome}
        filter={filter}
        dateStr={state.date}
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
              selectedDataId={state.id}
              handleEdit={(_data) => {
                dispatch({
                  type: 'RESET',
                  payload: _data,
                });
                setIsNewData(false);
                modalRef.current?.open();
              }}
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
              selectedDataId={state.id}
              handleEdit={(_data) => {
                dispatch({
                  type: 'RESET',
                  payload: _data,
                });
                setIsNewData(false);
                modalRef.current?.open();
              }}
              refreshData={refreshData}
            />
          )}
        </CategoryAccordion>
      </div>

      <AddExpenseBtn
        onClick={() => {
          setIsNewData(true);
          modalRef.current?.open();
        }}
        borderStyle="conic-gradient-from-purple-to-red"
      >
        <span className="text-base font-bold">記帳</span>
      </AddExpenseBtn>
      <EditExpenseModal
        ref={modalRef}
        data={state}
        isNewData={isNewData}
        reset={reset}
      />
    </div>
  );
};
