'use client';

import { Loading } from '@/components/icons/Loading';
import { useGroupCtx } from '@/context/GroupProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { getGroups } from '@/services/groupServices';
import { useSession } from 'next-auth/react';
import { redirect, useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const InviteConfirm = () => {
  const { id } = useParams();
  const { status } = useSession();
  const { config, loading: loadingUserData } = useUserConfigCtx();
  const { syncGroup, groups } = useGroupCtx();
  const [matchedGroup, setMatchedGroup] = useState<Group>();

  const handleJoinGroup = useCallback(async () => {
    if (!config?.user_id || !matchedGroup?.account_id) {
      alert('無法加入群組，缺少必要資訊');
      return;
    }

    // Check if already a member
    const isAlreadyMember = groups.some(
      (group) => group.account_id === matchedGroup.account_id
    );

    if (isAlreadyMember) {
      alert('已加入該群組');
      redirect('/group');
      return;
    }

    try {
      // Add member to account_members table via API
      const response = await fetch('/api/aurora/group/member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: matchedGroup.account_id,
          user_id: config.user_id,
          role: 'Viewer',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add group member');
      }

      // Refresh groups list
      syncGroup(config.user_id);

      alert('成功加入群組！');
      redirect('/group');
    } catch (error) {
      console.error('加入群組失敗:', error);
      alert('加入群組失敗，請稍後再試');
    }
  }, [config, matchedGroup, groups, syncGroup]);

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
