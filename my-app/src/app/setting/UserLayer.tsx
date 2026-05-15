'use client';

import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { IDB_NAME } from '@/utils/constants';
import { useState } from 'react';

const LS_PREFIX = 'st:';

function clearAllCache(): Promise<void> {
  // Clear localStorage entries with our prefix
  const keysToRemove = Object.keys(window.localStorage).filter((k) =>
    k.startsWith(LS_PREFIX),
  );
  keysToRemove.forEach((k) => window.localStorage.removeItem(k));

  // Delete IndexedDB database
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(IDB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}

export const UserLayer = () => {
  const { config: userData } = useUserConfigCtx();
  const [clearing, setClearing] = useState(false);

  if (!userData) return null;

  const handleClearCache = async () => {
    if (!window.confirm('確定要清除所有本地快取資料嗎？清除後頁面將重新載入。')) return;
    setClearing(true);
    await clearAllCache();
    window.location.reload();
  };

  return (
    <div className="flex w-80 flex-col divide-y divide-gray-300 rounded-3xl border border-solid border-gray-300 p-4">
      <div className="flex flex-col gap-2 pb-4">
        <span className="text-sm font-medium text-gray-500">資料管理</span>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm">清除本地快取</span>
            <span className="text-xs text-gray-400">清除 IndexedDB 與 localStorage 快取資料</span>
          </div>
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {clearing ? '清除中…' : '清除'}
          </button>
        </div>
      </div>
    </div>
  );
};
