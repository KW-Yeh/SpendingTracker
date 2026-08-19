import { BookIcon } from '@/components/icons/BookIcon';
import { Select } from '@/components/Select';
import { useGroupCtx } from '@/context/GroupProvider';
import { setCookie } from '@/utils/handleCookie';
import { useCallback } from 'react';

interface Props {
  className?: string;
  /** `pill` is the compact form used inside PageControlBar. */
  variant?: 'default' | 'pill';
}

export const GroupSelector = ({
  className = '',
  variant = 'default',
}: Props) => {
  const { loading, groups, currentGroup, setCurrentGroup } = useGroupCtx();
  const isPill = variant === 'pill';

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

  const groupName = currentGroup?.name ?? '載入帳本資訊中...';

  return (
    <Select
      name="group"
      value={groupName}
      onChange={handleOnSelectGroup}
      label={
        isPill ? (
          <span className="flex items-center gap-1.5 overflow-hidden">
            <BookIcon className="size-[15px] shrink-0 text-gray-400" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {groupName}
            </span>
          </span>
        ) : undefined
      }
      caretStyle={isPill ? 'text-gray-400' : ''}
      className={
        isPill
          ? `hover:border-primary-400 active:border-primary-500 !min-h-11 rounded-full border border-solid border-black/[0.08] bg-gray-950 px-3.5 text-[13px] font-semibold text-gray-100 transition-colors ${className}`
          : `hover:border-primary-400 active:border-primary-500 max-w-50 rounded-full border border-solid border-gray-700 bg-gray-950/90 px-4 py-2 text-gray-100 backdrop-blur-sm transition-all duration-200 ${className}`
      }
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
