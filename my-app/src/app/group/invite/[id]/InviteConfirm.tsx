'use client';

import { Loading } from '@/components/icons/Loading';
import { useGroupCtx } from '@/context/GroupProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { signIn } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const InviteConfirm = () => {
  const { id } = useParams();
  const router = useRouter();
  const { config, loading: loadingUserData } = useUserConfigCtx();
  const { syncGroup, groups } = useGroupCtx();
  const [invitedGroup, setInvitedGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 獲取被邀請的群組資訊
  useEffect(() => {
    if (!id) {
      setError('無效的邀請連結');
      setLoading(false);
      return;
    }

    // 透過 account_id 查詢單個群組資訊
    fetch(`/api/aurora/groups?id=${id}&type=single`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setInvitedGroup(data[0]);
        } else {
          setError('找不到該群組');
        }
      })
      .catch((err) => {
        console.error('查詢群組失敗:', err);
        setError('查詢群組失敗，請稍後再試');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // 處理未登入用戶的登入流程
  const handleLogin = useCallback(() => {
    const currentPath = window.location.pathname;
    signIn(undefined, { callbackUrl: currentPath });
  }, []);

  const handleJoinGroup = useCallback(async () => {
    if (!config?.user_id || !invitedGroup?.account_id) {
      alert('無法加入群組，缺少必要資訊');
      return;
    }

    // 檢查是否已是成員
    const isAlreadyMember = groups.some(
      (group) => group.account_id === invitedGroup.account_id
    );

    if (isAlreadyMember) {
      alert('您已經是該群組的成員了');
      router.push('/group');
      return;
    }

    setLoading(true);
    try {
      // 添加成員到 account_members 表
      const response = await fetch('/api/aurora/group/member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: invitedGroup.account_id,
          user_id: config.user_id,
          role: 'Viewer',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add group member');
      }

      // 刷新群組列表
      await syncGroup(config.user_id);

      alert('成功加入群組！');
      router.push('/group');
    } catch (error) {
      console.error('加入群組失敗:', error);
      alert('加入群組失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  }, [config, invitedGroup, groups, syncGroup, router]);

  // 顯示載入中
  if (loading || loadingUserData) {
    return (
      <div className="m-auto">
        <Loading className="text-text size-10 animate-spin" />
      </div>
    );
  }

  // 顯示錯誤
  if (error || !invitedGroup) {
    return (
      <div className="bg-background flex w-80 flex-col rounded-2xl border border-solid border-red-300 p-6 text-center shadow">
        <p className="text-red-500">{error || '無法載入群組資訊'}</p>
        <button
          type="button"
          onClick={() => router.push('/group')}
          className="mt-4 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          返回群組頁面
        </button>
      </div>
    );
  }

  // 用戶未登入，顯示登入提示
  if (!config?.user_id) {
    return (
      <div className="bg-background flex w-80 flex-col rounded-2xl border border-solid border-blue-300 p-6 text-center shadow">
        <h2 className="mb-4 text-lg font-bold">需要登入</h2>
        <p className="mb-2 text-gray-600">
          您收到了加入帳本
          <strong className="mx-1 text-blue-600">{invitedGroup.name}</strong>
          的邀請
        </p>
        <p className="mb-6 text-sm text-gray-500">請先登入以繼續加入帳本</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleLogin}
            className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            前往登入
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex w-80 flex-col rounded-2xl border border-solid border-gray-300 pt-5 pb-4 shadow">
      <h1 className="mb-6 w-full px-5 text-start text-lg sm:text-xl">
        是否加入
        <strong className="ml-2 font-bold">{invitedGroup.name}</strong>
        帳本？
      </h1>
      <div className="px-5 pb-4">
        <p className="mb-2 text-sm text-gray-600">帳本資訊：</p>
        <div className="rounded-lg bg-gray-50 p-3 text-sm">
          <p>
            <span className="font-medium">擁有者：</span>
            {invitedGroup.owner_name || invitedGroup.owner_email || '未知'}
          </p>
          <p className="mt-1">
            <span className="font-medium">成員數量：</span>
            {invitedGroup.member_count || 0} 人
          </p>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          加入後您將成為 <strong>Viewer</strong>（檢視者）角色
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-solid border-gray-300 px-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/group')}
          className="active:text-background hover:text-background rounded border border-solid border-red-500 px-6 py-1 text-red-500 transition-colors hover:bg-red-500 active:bg-red-500"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleJoinGroup}
          disabled={loading}
          className="text-background rounded border border-solid border-green-500 bg-green-500 px-6 py-1 transition-colors hover:border-green-400 hover:bg-green-400 active:border-green-400 active:bg-green-400 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-400"
        >
          {loading ? '加入中...' : '加入'}
        </button>
      </div>
    </div>
  );
};
