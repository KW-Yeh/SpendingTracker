'use client';

import { SpendingList } from '@/app/insert/SpendingList';
import { DatePicker } from '@/components/DatePicker';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { Switch } from '@/components/Switch';
import { EditExpenseModal } from '@/composites/EditExpenseModal';
import { GroupSelector } from '@/composites/GroupSelector';
import { useGroupCtx } from '@/context/GroupProvider';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useSpendingReducer } from '@/hooks/useSpendingReducer';
import { DateFilter, SpendingType } from '@/utils/constants';
import {
  ChangeEvent,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v7 as uuid } from 'uuid';

export const SpendingInfoSection = () => {
  const [state, dispatch] = useSpendingReducer();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string>();
  const { config: userData } = useUserConfigCtx();
  const { syncData, loading } = useGetSpendingCtx();
  const { syncGroup } = useGroupCtx();
  const modalRef = useRef<ModalRef>(null);
  const [isNewData, setIsNewData] = useState(false);
  const [filter, setFilter] = useState(DateFilter.Day);

  const handleOnChangeDate = (event: ChangeEvent) => {
    const date = new Date((event.target as HTMLInputElement).value);
    startTransition(() => {
      dispatch({
        type: 'SET_DATE',
        payload: date.toUTCString(),
      });
    });
  };

  const refreshData = useCallback(() => {
    syncData(selectedGroup || undefined, userData?.email);
  }, [selectedGroup, syncData, userData?.email]);

  useEffect(() => {
    if (selectedGroup === '' && userData) {
      syncData(undefined, userData.email);
    } else {
      syncData(selectedGroup, undefined);
    }
  }, [selectedGroup, userData, syncData]);

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
      <Switch
        value={state.type}
        className="text-sm sm:text-base"
        onChange={(type) => {
          dispatch({
            type: 'SET_TYPE',
            payload: type as SpendingType,
          });
        }}
        option1={{
          value: SpendingType.Outcome,
          label: '支出',
          onSelectColor: '#fca5a5',
        }}
        option2={{
          value: SpendingType.Income,
          label: '收入',
          onSelectColor: '#86efac',
        }}
      />
      <div className="flex w-full max-w-175 items-center justify-center gap-2">
        <DatePicker date={new Date(state.date)} onChange={handleOnChangeDate} />
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

      <button
        type="button"
        className="fixed bottom-8 z-40 mx-auto w-40 rounded-full border border-solid border-gray-300 bg-background p-4 font-bold shadow transition-colors active:border-text sm:hover:border-text"
        onClick={() => {
          setIsNewData(true);
          modalRef.current?.open();
        }}
      >
        記帳
      </button>
      <div className="flex w-full max-w-175 items-center gap-2">
        <GroupSelector
          selectedGroup={selectedGroup}
          selectedMemberEmail={selectedMemberEmail}
          onSelectGroup={setSelectedGroup}
          onSelectMemberEmail={setSelectedMemberEmail}
        />
      </div>
      <SpendingList
        type={state.type as SpendingType}
        dateFilter={filter}
        date={new Date(state.date)}
        selectedDataId={state.id}
        handleEdit={(data) => {
          dispatch({
            type: 'RESET',
            payload: data,
          });
          setIsNewData(false);
          modalRef.current?.open();
        }}
        refreshData={refreshData}
        memberEmail={selectedMemberEmail}
        reset={reset}
      />
      <EditExpenseModal
        ref={modalRef}
        data={state}
        isNewData={isNewData}
        reset={reset}
      />
    </div>
  );
};
