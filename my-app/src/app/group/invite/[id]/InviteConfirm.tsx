'use client';

import { Loading } from '@/components/icons/Loading';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useGroupCtx } from '@/context/GroupProvider';
import { putGroup, putUser } from '@/services/dbHandler';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

export const InviteConfirm = () => {
  const { id } = useParams();
  const { syncUser, config, loading: loadingUserData } = useUserConfigCtx();
  const { groups, syncGroup, loading: loadingGroupData } = useGroupCtx();

  const matchedGroup = useMemo(() => groups[0], [groups]);

  const handleUpdateUser = useCallback(
    async (config: User, id: string) => {
      const userGroups = new Set(config.groups);
      if (userGroups.has(id)) {
        alert('已加入該群組');
        redirect('/group');
      }
      userGroups.add(id);
      await putUser({
        ...config,
        groups: Array.from(userGroups),
      });
      syncUser();
    },
    [syncUser],
  );

  const handleUpdateGroup = useCallback(
    async (group: Group, userInfo: User) => {
      const users = group.users;
      const existence = users.find((user) => user.email === userInfo.email);
      if (existence) {
        alert('已加入該群組');
        redirect('/group');
      }
      users.push(userInfo);
      await putGroup({
        ...group,
        users: Array.from(users),
      });
      syncGroup(userInfo.groups);
    },
    [syncGroup],
  );

  const handleJoinGroup = useCallback(async () => {
    if (!config) return;
    if (!matchedGroup) return;
    await handleUpdateUser(config, matchedGroup.id);
    await handleUpdateGroup(matchedGroup, config);
    redirect('/group');
  }, [config, handleUpdateGroup, handleUpdateUser, matchedGroup]);

  useEffect(() => {
    if (!loadingGroupData && groups.length === 0) {
      alert('該群組邀請連結已經遺失');
      redirect('/');
    }
  }, [groups, loadingGroupData]);

  useEffect(() => {
    if (!loadingUserData && config?.email) {
      syncGroup(id);
    } else {
      alert('請先登入再加入群組');
      redirect('/login');
    }
  }, [loadingUserData, config, id, syncGroup]);

  if (!matchedGroup)
    return (
      <div className="m-auto">
        <Loading className="size-10 animate-spin text-text" />
      </div>
    );

  return (
    <div className="m-auto flex w-full max-w-80 flex-col rounded-xl border border-solid border-gray-300 bg-background py-4 shadow">
      <h1 className="mb-6 w-full px-4 text-start text-lg font-bold sm:text-xl">
        是否加入
        <span className="clipped-text gradient-r-from-purple-to-blue">
          {matchedGroup.name}
        </span>
        群組?
      </h1>
      <p className="flex flex-wrap items-center gap-2 px-4 pb-4 text-sm sm:text-base">
        群組成員有:
        {matchedGroup.users.map((user) => (
          <Image
            src={user.image}
            key={user.email}
            alt={user.name}
            title={user.name}
            width={20}
            height={20}
            className="rounded-full"
          />
        ))}
      </p>
      <div className="flex items-center justify-between gap-4 border-t border-solid border-gray-300 px-4 pt-4">
        <button
          type="button"
          onClick={() => redirect('/group')}
          className="rounded-md border border-solid border-red-500 px-6 py-1 text-red-500 transition-colors active:bg-red-500 active:text-background sm:hover:bg-red-500 sm:hover:text-background"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleJoinGroup}
          className="rounded-md border border-solid border-green-500 bg-green-500 px-6 py-1 text-background transition-colors active:bg-green-300 sm:hover:bg-green-300"
        >
          加入
        </button>
      </div>
    </div>
  );
};
