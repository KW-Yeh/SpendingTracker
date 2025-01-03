'use client';

import { Select } from '@/components/Select';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useRoleCtx } from '@/context/UserRoleProvider';
import { putUser } from '@/services/dbHandler';
import { PAGE_TITLE } from '@/utils/constants';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export const RouteTitle = () => {
  const pathName = usePathname();
  const { group: selectedGroup, groups } = useRoleCtx();
  const { config, syncUser } = useUserConfigCtx();

  const handleSelectGroup = useCallback(
    (groupId: string) => {
      if (!config) return;
      putUser({
        ...config,
        defaultGroup: config.defaultGroup === groupId ? undefined : groupId,
      }).then(() => {
        syncUser();
      });
    },
    [config, syncUser],
  );

  return (
    <div className="flex items-center text-center text-lg font-bold sm:text-xl">
      <h1>{PAGE_TITLE[pathName]}</h1>
      {groups.length > 0 && (
        <div className="ml-1 flex items-center">
          （
          <Select
            name="group"
            value={selectedGroup?.name ?? '個人'}
            onChange={handleSelectGroup}
            caretStyle="size-5"
          >
            <Select.Item value="" className="text-base">
              個人
            </Select.Item>
            {groups.map((group) => (
              <Select.Item
                key={group.id}
                value={group.id}
                className="text-base"
              >
                {group.name}
              </Select.Item>
            ))}
          </Select>
          ）
        </div>
      )}
    </div>
  );
};
