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
      (group) => group.account_id === invitedGroup.account_id,
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
      <div className="card border-secondary-300 flex w-80 flex-col border-2 text-center">
        <p className="text-secondary-600 font-semibold">
          {error || '無法載入群組資訊'}
        </p>
        <button
          type="button"
          onClick={() => router.push('/group')}
          className="btn-secondary mt-4 min-h-11"
        >
          返回群組頁面
        </button>
      </div>
    );
  }

  // 用戶未登入，顯示登入提示
  if (!config?.user_id) {
    return (
      <div className="card border-primary-300 flex w-80 flex-col border-2 text-center">
        <h2
          className="mb-4 text-lg font-bold text-gray-800"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          需要登入
        </h2>
        <p className="mb-2 text-gray-600">
          您收到了加入帳本
          <strong className="text-primary-600 mx-1">{invitedGroup.name}</strong>
          的邀請
        </p>
        <p className="mb-6 text-sm text-gray-300">請先登入以繼續加入帳本</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleLogin}
            className="btn-primary min-h-11"
          >
            前往登入
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="hover:text-primary-600 text-sm font-medium text-gray-600 transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex w-80 flex-col pt-5 pb-4">
      <h1
        className="mb-6 w-full px-5 text-start text-lg text-gray-800 sm:text-xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        是否加入
        <strong className="text-primary-600 ml-2 font-bold">
          {invitedGroup.name}
        </strong>
        帳本？
      </h1>
      <div className="px-5 pb-4">
        <p className="mb-2 text-sm font-semibold text-gray-600">帳本資訊：</p>
        <div className="bg-primary-50 border-primary-100 rounded-xl border p-3 text-sm">
          <p className="text-gray-700">
            <span className="font-semibold">擁有者：</span>
            {invitedGroup.owner_name || invitedGroup.owner_email || '未知'}
          </p>
          <p className="mt-1 text-gray-700">
            <span className="font-semibold">成員數量：</span>
            {invitedGroup.member_count || 0} 人
          </p>
        </div>
        <p className="mt-3 text-xs text-gray-300">
          加入後您將成為 <strong className="text-primary-600">Viewer</strong>
          （檢視者）角色
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-solid border-gray-200 px-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/group')}
          className="btn-secondary min-h-11 px-6"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleJoinGroup}
          disabled={loading}
          className="from-income-500 to-income-600 min-h-11 rounded-xl bg-linear-to-r px-6 font-semibold text-white shadow-sm transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:shadow-[0_0_10px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? '加入中...' : '加入'}
        </button>
      </div>
    </div>
  );
};
