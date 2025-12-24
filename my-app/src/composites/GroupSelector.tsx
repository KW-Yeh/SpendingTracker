import { Select } from '@/components/Select';
import { useGroupCtx } from '@/context/GroupProvider';
import { setCookie } from '@/utils/handleCookie';
import { useCallback } from 'react';

export const GroupSelector = ({ className = '' }: { className?: string }) => {
  const { loading, groups, currentGroup, setCurrentGroup } = useGroupCtx();

  const handleOnSelectGroup = useCallback(
    (groupId: string) => {
      const newGroup = groups.find(
        (group) => String(group.account_id) === groupId,
      );
      if (newGroup) {
        setCookie('currentGroupId', String(newGroup.account_id), {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        setCurrentGroup(newGroup);
      }
    },
    [groups, setCurrentGroup],
  );

  return (
    <Select
      name="group"
      value={currentGroup?.name ?? '載入帳本資訊中...'}
      onChange={handleOnSelectGroup}
      className={`bg-background max-w-50 rounded-full border border-solid border-gray-300 px-3 py-1 transition-colors active:border-gray-500 sm:hover:border-gray-500 ${className}`}
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
