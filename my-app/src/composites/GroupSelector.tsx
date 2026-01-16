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
      className={`hover:border-primary-400 active:border-primary-500 max-w-50 rounded-xl border-2 border-solid border-gray-600 bg-gray-800/90 px-4 py-2 text-gray-100 backdrop-blur-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] ${className}`}
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
