import { Select } from '@/components/Select';
import { useGroupCtx } from '@/context/GroupProvider';
import { useCallback } from 'react';

export const GroupSelector = ({ className = '' }: { className?: string }) => {
  const { loading, groups, currentGroup, setCurrentGroup } = useGroupCtx();

  const handleOnSelectGroup = useCallback(
    (groupId: string) => {
      console.log(groups, groupId);
      const newGroup = groups.find(
        (group) => String(group.account_id) === groupId,
      );
      console.log('Selected group:', newGroup);
      if (newGroup) setCurrentGroup(newGroup);
    },
    [groups, setCurrentGroup],
  );

  return (
    <Select
      name="group"
      value={currentGroup?.name ?? '...'}
      onChange={handleOnSelectGroup}
      className={`bg-background max-w-25 rounded-full border border-solid border-gray-300 px-3 py-1 transition-colors active:border-gray-500 sm:hover:border-gray-500 ${className}`}
    >
      {!loading &&
        groups.map(
          (group) =>
            group.account_id && (
              <Select.Item
                key={group.account_id}
                value={group.account_id.toString()}
                className="text-sm"
              >
                {group.name}
              </Select.Item>
            ),
        )}
    </Select>
  );
};
