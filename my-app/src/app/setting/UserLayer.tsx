'use client';

import { BookIcon } from '@/components/icons/BookIcon';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { UserAvatar } from '@/components/UserAvatar';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { IDB_NAME } from '@/utils/constants';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

const LS_PREFIX = 'st:';

function clearAllCache(): Promise<void> {
  const keysToRemove = Object.keys(window.localStorage).filter((k) =>
    k.startsWith(LS_PREFIX),
  );
  keysToRemove.forEach((k) => window.localStorage.removeItem(k));

  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(IDB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}

const ChevronRight = () => (
  <svg
    className="size-4 shrink-0 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const SectionLabel = ({ children }: { children: string }) => (
  <p className="mb-1.5 px-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
    {children}
  </p>
);

const RowGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="divide-y divide-black/[0.06] overflow-hidden rounded-2xl border border-black/[0.06] bg-gray-950">
    {children}
  </div>
);

export const UserLayer = () => {
  const { config: userData } = useUserConfigCtx();
  const [clearing, setClearing] = useState(false);

  if (!userData) return null;

  const handleClearCache = async () => {
    if (!window.confirm('確定要清除所有本地快取資料嗎？清除後頁面將重新載入。'))
      return;
    setClearing(true);
    await clearAllCache();
    window.location.reload();
  };

  const handleSignOut = async () => {
    if (confirm('確定要登出嗎？')) {
      await signOut({ callbackUrl: '/login' });
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-5 px-4 py-6">
      {/* Page title */}
      <h1
        className="mb-2 text-xl font-bold text-gray-100"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        設定
      </h1>

      {/* ── 個人資料 ─────────────────────────────────────── */}
      <Link
        href="/profile"
        className="group flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-gray-950 p-4 transition-colors hover:bg-gray-950"
      >
        <div className="ring-primary-500/20 size-12 shrink-0 overflow-hidden rounded-full ring-2">
          <UserAvatar user={userData} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-100">
            {userData.name}
          </p>
          <p className="truncate text-xs text-gray-400">{userData.email}</p>
          <p className="mt-0.5 text-xs text-gray-500">查看與編輯個人資料</p>
        </div>
        <ChevronRight />
      </Link>

      {/* ── 帳本 ──────────────────────────────────────────── */}
      <div>
        <SectionLabel>帳本</SectionLabel>
        <RowGroup>
          <Link
            href="/group"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-black/[0.03]"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
              <BookIcon className="size-4 text-cyan-400" />
            </span>
            <span className="flex-1 text-sm font-medium text-gray-200">
              帳本管理
            </span>
            <ChevronRight />
          </Link>
        </RowGroup>
      </div>

      {/* ── 資料管理 ──────────────────────────────────────── */}
      <div>
        <SectionLabel>資料管理</SectionLabel>
        <RowGroup>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
              <DeleteIcon className="size-4 text-rose-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-200">清除本地快取</p>
              <p className="text-xs text-gray-500">localStorage 與舊版快取</p>
            </div>
            <button
              onClick={handleClearCache}
              disabled={clearing}
              className="min-h-8 px-3 text-xs font-semibold text-rose-400 transition-colors hover:text-rose-300 disabled:opacity-50"
            >
              {clearing ? '清除中…' : '清除'}
            </button>
          </div>
        </RowGroup>
      </div>

      {/* ── 帳號 ──────────────────────────────────────────── */}
      <div>
        <SectionLabel>帳號</SectionLabel>
        <RowGroup>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3.5 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/5"
          >
            登出
          </button>
        </RowGroup>
      </div>
    </div>
  );
};
