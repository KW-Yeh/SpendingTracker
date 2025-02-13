'use client';

import { Select } from '@/components/Select';
import { useGroupCtx } from '@/context/GroupProvider';
import { useCallback, useMemo } from 'react';

interface Props {
  selectedGroup?: string;
  selectedMemberEmail?: string;
  onSelectGroup: (groupId: string) => void;
  onSelectMemberEmail: (email?: string) => void;
  showMemberSelector?: boolean;
  selectorStyle?: string;
}

export const GroupSelector = (props: Props) => {
  const {
    selectedGroup,
    selectedMemberEmail,
    onSelectGroup,
    onSelectMemberEmail,
    showMemberSelector = true,
    selectorStyle,
  } = props;
  const { groups, loading } = useGroupCtx();

  const group = useMemo(
    () => groups.find((group) => group.id === selectedGroup),
    [groups, selectedGroup],
  );

  const selectedMember = useMemo(
    () => group?.users.find((user) => user.email === selectedMemberEmail),
    [group?.users, selectedMemberEmail],
  );

  const handleOnSelectGroup = useCallback(
    (groupId: string) => {
      if (loading) return;
      onSelectGroup(groupId);
    },
    [loading, onSelectGroup],
  );

  return (
    <div className="flex w-full items-center gap-1 text-sm sm:text-base">
      <Select
        name="group"
        value={group?.name ?? '個人'}
        onChange={handleOnSelectGroup}
        className={`rounded-full border border-solid border-gray-300 px-3 py-1 transition-colors active:border-text sm:hover:border-text ${selectorStyle}`}
      >
        <Select.Item value="">個人</Select.Item>
        {!loading &&
          groups.map((group) => (
            <Select.Item key={group.id} value={group.id}>
              {group.name}
            </Select.Item>
          ))}
      </Select>

      {group && showMemberSelector && (
        <>
          <span className="ml-2">成員</span>
          <Select
            name="member"
            value={selectedMember?.name ?? '全部'}
            onChange={onSelectMemberEmail}
            className={`rounded-full border border-solid border-gray-300 px-3 py-1 transition-colors active:border-text sm:hover:border-text ${selectorStyle}`}
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
