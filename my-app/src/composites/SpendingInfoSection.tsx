'use client';

import { DatePicker } from '@/components/DatePicker';
import { RefreshIcon } from '@/components/icons/RefreshIcon';
import { Select } from '@/components/Select';
import { EditorBlock } from '@/composites/EditorBlock';
import { SpendingList } from '@/composites/SpendingList';
import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { SpendingType } from '@/utils/constants';
import {
  ChangeEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const SpendingInfoSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState<SpendingRecord>();
  const [selectedType, setSelectedType] = useState<SpendingType>(
    SpendingType.Outcome,
  );
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [selectedMember, setSelectedMember] = useState<MemberType>();
  const { syncData, loading } = useGetSpendingCtx();

  const handleOnChangeDate = (event: ChangeEvent) => {
    const date = new Date((event.target as HTMLInputElement).value);
    startTransition(() => {
      setSelectedDate(date);
    });
  };

  const reset = () => {
    setSelectedData(undefined);
  };

  useEffect(() => {
    if (selectedData?.id) {
      setSelectedDate(new Date(selectedData.date));
    }
  }, [selectedData?.id, selectedData?.date]);

  return (
    <div className="relative flex w-full flex-1 flex-col items-center gap-4 p-6">
      <div className="absolute right-6 top-6">
        <button
          type="button"
          onClick={() => syncData()}
          disabled={loading}
          className="rounded-md bg-gray-300 p-2 transition-colors active:bg-gray-400 sm:hover:bg-gray-400"
        >
          <RefreshIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <Switch type={selectedType} onChange={setSelectedType} />
      <DatePicker date={selectedDate} onChange={handleOnChangeDate} />
      <div className="flex w-full max-w-175 flex-wrap justify-between gap-2">
        <GroupSelector
          selectedGroup={selectedGroup}
          selectedMember={selectedMember}
          onSelectGroup={setSelectedGroup}
          onSelectMember={setSelectedMember}
        />
        <button
          type="button"
          onClick={reset}
          className="w-fit rounded-md border border-solid border-gray-300 px-2 py-1 text-xs transition-colors active:border-text sm:text-sm sm:hover:border-text lg:text-base"
        >
          重置編輯器
        </button>
      </div>
      <EditorBlock
        type={selectedType}
        date={selectedDate}
        data={selectedData}
        groupId={selectedGroup}
        member={selectedMember}
        reset={reset}
      />
      <SpendingList
        type={selectedType}
        date={selectedDate}
        groupId={selectedGroup}
        member={selectedMember}
        onSelectMember={setSelectedMember}
        handleEdit={setSelectedData}
      />
    </div>
  );
};

const GroupSelector = ({
  selectedGroup,
  selectedMember,
  onSelectGroup,
  onSelectMember,
}: {
  selectedGroup?: string;
  selectedMember?: MemberType;
  onSelectGroup: (groupId: string) => void;
  onSelectMember: (member?: MemberType) => void;
}) => {
  const { myGroups: groups, loading } = useUserConfigCtx();

  const group = useMemo(
    () => groups.find((group) => group.id === selectedGroup),
    [groups, selectedGroup],
  );

  const handleOnSelectMember = useCallback(
    (email: string) => {
      if (!group) return;
      const member = group.users.find((user) => user.email === email);
      onSelectMember(member);
    },
    [onSelectMember, group],
  );

  return (
    <div className="flex items-center gap-1 text-sm sm:text-base">
      <span>群組</span>
      <Select
        name="group"
        value={group?.name ?? '個人'}
        onChange={onSelectGroup}
        className="max-w-24 rounded-md border border-solid border-gray-300 px-2 py-1 transition-colors active:border-text sm:hover:border-text"
      >
        <Select.Item value="">個人</Select.Item>
        {!loading &&
          groups.map((group) => (
            <Select.Item key={group.id} value={group.id}>
              {group.name}
            </Select.Item>
          ))}
      </Select>

      {group && (
        <>
          <span>成員</span>
          <Select
            name="member"
            value={selectedMember?.name ?? '全部'}
            onChange={handleOnSelectMember}
            className="max-w-24 rounded-md border border-solid border-gray-300 px-2 py-1 transition-colors active:border-text sm:hover:border-text"
          >
            <Select.Item value="">全部</Select.Item>
            {group.users.map((user) => (
              <Select.Item key={user.email} value={user.email}>
                {user.name}
              </Select.Item>
            ))}
          </Select>
        </>
      )}
    </div>
  );
};

const Switch = ({
  type,
  onChange,
}: {
  type: SpendingType;
  onChange: (type: SpendingType) => void;
}) => {
  const handleOnClick = (type: SpendingType) => {
    startTransition(() => {
      onChange(type);
    });
  };
  return (
    <div className="flex items-center gap-1 text-sm sm:text-base">
      <button
        className={`rounded-l border border-solid border-red-500 px-6 py-2 text-center transition-colors ${type === SpendingType.Outcome ? 'bg-red-300' : 'text-red-500 hover:bg-red-300'}`}
        onClick={() => handleOnClick(SpendingType.Outcome)}
      >
        支出
      </button>
      <button
        className={`rounded-r border border-solid border-green-500 px-6 py-2 text-center transition-colors ${type === SpendingType.Income ? 'bg-green-300' : 'text-green-500 hover:bg-green-300'}`}
        onClick={() => handleOnClick(SpendingType.Income)}
      >
        收入
      </button>
    </div>
  );
};
