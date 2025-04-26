import { Select } from '@/components/Select';
import { useGroupCtx } from '@/context/GroupProvider';
import { useCallback } from 'react';

export const GroupSelector = ({ className = '' }: { className?: string }) => {
  const { loading, groups, currentGroup, setCurrentGroup } = useGroupCtx();

  const handleOnSelectGroup = useCallback(
    (groupId: string) => {
      setCurrentGroup(groups.find((group) => group.id === groupId));
    },
    [groups, setCurrentGroup],
  );

  return (
    <Select
      name="group"
      value={currentGroup?.name ?? '個人'}
      onChange={handleOnSelectGroup}
      className={`bg-background rounded-full border border-solid border-gray-300 px-3 py-1 transition-colors active:border-gray-500 sm:hover:border-gray-500 ${className}`}
    >
      <Select.Item value="">個人</Select.Item>
      {!loading &&
        groups.map((group) => (
          <Select.Item key={group.id} value={group.id}>
            {group.name}
          </Select.Item>
        ))}
    </Select>
  );
};
