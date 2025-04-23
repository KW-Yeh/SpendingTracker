'use client';

import { Loading } from '@/components/icons/Loading';
import { useGroupCtx } from '@/context/GroupProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getGroups, putGroup } from '@/services/groupServices';
import { putUser } from '@/services/userServices';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const InviteConfirm = () => {
  const { id } = useParams();
  const { status } = useSession();
  const { syncUser, config, loading: loadingUserData } = useUserConfigCtx();
  const { syncGroup } = useGroupCtx();
  const [matchedGroup, setMatchedGroup] = useState<Group>();

  const handleUpdateUser = useCallback(async (config: User, id: string) => {
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
  }, []);

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
    },
    [],
  );

  const handleJoinGroup = useCallback(async () => {
    if (!config) return;
    if (!matchedGroup) {
      alert('該群組邀請連結已經遺失');
      redirect('/');
    }
    await handleUpdateUser(config, matchedGroup.id);
    syncUser();
    await handleUpdateGroup(matchedGroup, config);
    syncGroup(config.groups);
    redirect('/group');
  }, [
    config,
    handleUpdateGroup,
    handleUpdateUser,
    matchedGroup,
    syncGroup,
    syncUser,
  ]);

  useEffect(() => {
    if (!loadingUserData && config?.email && id) {
      getGroups(id)
        .then(({ data: res }) => {
          setMatchedGroup(res[0]);
        })
        .catch(console.error);
    } else if (status === 'unauthenticated') {
      alert('請先登入再加入群組');
      redirect('/login');
    }
  }, [loadingUserData, config, id, syncGroup, status]);

  if (!matchedGroup)
    return (
      <div className="m-auto">
        <Loading className="size-10 animate-spin text-text" />
      </div>
    );

  return (
    <div className="flex w-80 flex-col rounded-2xl border border-solid border-gray-300 bg-background pb-4 pt-5 shadow">
      <h1 className="mb-6 w-full px-5 text-start text-lg sm:text-xl">
        是否加入
        <strong className="font-bold">{matchedGroup.name}</strong>
        群組？
      </h1>
      <p className="flex flex-wrap items-center gap-2 px-4 pb-4 text-sm sm:text-base">
        群組成員有：
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
          className="rounded border border-solid border-red-500 px-6 py-1 text-red-500 transition-colors active:bg-red-500 active:text-background hover:bg-red-500 hover:text-background"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleJoinGroup}
          className="rounded border border-solid border-green-500 bg-green-500 px-6 py-1 text-background transition-colors active:border-green-400 active:bg-green-400 hover:border-green-400 hover:bg-green-400"
        >
          加入
        </button>
      </div>
    </div>
  );
};
