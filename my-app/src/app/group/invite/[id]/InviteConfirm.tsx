'use client';

import { Loading } from '@/components/icons/Loading';
import { useGroupCtx } from '@/context/GroupProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getGroups, putGroup } from '@/services/groupServices';
import { putUser } from '@/services/userServices';
import { useSession } from 'next-auth/react';
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
      // 更新群組成員
    },
    [],
  );

  const handleJoinGroup = useCallback(async () => {
    // 加入群組
  }, []);

  useEffect(() => {
    if (!loadingUserData && config?.user_id) {
      getGroups(config.user_id)
        .then(({ data: res }) => {
          setMatchedGroup(res[0]);
        })
        .catch(console.error);
    } else if (status === 'unauthenticated') {
      alert('請先登入再加入群組');
      redirect('/login');
    }
  }, [loadingUserData, config, status]);

  if (!matchedGroup)
    return (
      <div className="m-auto">
        <Loading className="text-text size-10 animate-spin" />
      </div>
    );

  return (
    <div className="bg-background flex w-80 flex-col rounded-2xl border border-solid border-gray-300 pt-5 pb-4 shadow">
      <h1 className="mb-6 w-full px-5 text-start text-lg sm:text-xl">
        是否加入
        <strong className="font-bold">{matchedGroup.name}</strong>
        群組？
      </h1>
      <p className="flex flex-wrap items-center gap-2 px-4 pb-4 text-sm sm:text-base">
        群組成員有：
      </p>
      <div className="flex items-center justify-between gap-4 border-t border-solid border-gray-300 px-4 pt-4">
        <button
          type="button"
          onClick={() => redirect('/group')}
          className="active:text-background hover:text-background rounded border border-solid border-red-500 px-6 py-1 text-red-500 transition-colors hover:bg-red-500 active:bg-red-500"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleJoinGroup}
          className="text-background rounded border border-solid border-green-500 bg-green-500 px-6 py-1 transition-colors hover:border-green-400 hover:bg-green-400 active:border-green-400 active:bg-green-400"
        >
          加入
        </button>
      </div>
    </div>
  );
};
