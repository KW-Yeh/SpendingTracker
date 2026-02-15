'use client';

import { UserAvatar } from '@/components/UserAvatar';
import { ImageCropper } from '@/components/ImageCropper';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { useIDB } from '@/hooks/useIDB';
import { syncAll } from '@/services/syncService';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { config: user, setter: setUser, syncUser } = useUserConfigCtx();
  const idb = useIDB();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Load last synced time
  useEffect(() => {
    if (idb.db && user?.user_id) {
      idb.getSyncMetadata(idb.db, user.user_id).then((meta) => {
        if (meta) {
          setLastSyncedAt(meta.last_synced_at);
        }
      });
    }
  }, [idb.db, user?.user_id, idb.getSyncMetadata]);

  const handleSync = useCallback(async () => {
    if (!idb.db || !user?.user_id || !user?.email) return;

    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);
    setSyncProgress(null);

    try {
      await syncAll(idb.db, user.user_id, user.email, idb, (progress) => {
        setSyncProgress(progress);
      });

      setSyncSuccess(true);
      setLastSyncedAt(new Date().toISOString());

      // Refresh user data from IDB after sync
      syncUser();
    } catch (err) {
      console.error('[Sync] Error:', err);
      setSyncError(err instanceof Error ? err.message : '同步失敗');
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
    }
  }, [idb, user?.user_id, user?.email, syncUser]);

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片檔案');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('圖片檔案不可超過 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempImageUrl(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('圖片讀取失敗');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('圖片上傳失敗');
      setIsUploading(false);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setAvatarUrl(croppedImage);
    setTempImageUrl(null);
  };

  const handleCropCancel = () => {
    setTempImageUrl(null);
  };

  const handleSave = async () => {
    if (!user?.user_id) return;

    setIsSaving(true);

    try {
      const updatedUser = {
        ...user,
        name,
        avatar_url: avatarUrl,
      };

      await setUser(updatedUser);
      alert('更新成功');
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('更新失敗，請稍後再試');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('確定要登出嗎？')) {
      await signOut({ callbackUrl: '/login' });
    }
  };

  const formatSyncTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSyncProgressLabel = (progress: SyncProgress) => {
    const entityLabels: Record<string, string> = {
      user: '使用者資料',
      groups: '群組資料',
      transactions: '交易記錄',
      budgets: '預算資料',
      favorites: '常用類別',
      uploading: '上傳資料',
    };
    const stepLabel = progress.step === 'pull' ? '下載' : '上傳';
    const entityLabel = entityLabels[progress.entity] || progress.entity;
    return `${stepLabel}${entityLabel}...`;
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-gray-300">載入中...</p>
      </div>
    );
  }

  return (
    <>
      {/* Image Cropper Modal */}
      {tempImageUrl && (
        <ImageCropper
          image={tempImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <div className="min-h-screen bg-gray-900 pb-20">
        {/* Header */}
        <div className="border-b border-gray-700 bg-gray-800/90 shadow-lg backdrop-blur-sm">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="hover:text-primary-400 active:text-primary-300 text-gray-400 transition-colors"
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-gray-100">個人資料</h1>
              <div className="w-6"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="rounded-lg border border-gray-700 bg-gray-800/90 p-6 shadow-xl backdrop-blur-sm">
            {/* Avatar Section */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="size-24 overflow-hidden rounded-full border-2 border-gray-600 shadow-lg">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full">
                      <UserAvatar user={{ ...user, avatar_url: avatarUrl }} />
                    </div>
                  )}
                </div>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <div className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-primary-400 hover:text-primary-300 active:text-primary-200 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? '上傳中...' : '更換頭像'}
              </button>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                名稱
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus:border-primary-400 w-full rounded-md border border-gray-600 bg-gray-700/50 px-4 py-2 text-gray-100 transition-all placeholder:text-gray-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)] focus:outline-none"
                placeholder="請輸入名稱"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full cursor-not-allowed rounded-md border border-gray-700 bg-gray-800/70 px-4 py-2 text-gray-500"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="from-primary-500 to-primary-600 mb-4 w-full rounded-md bg-linear-to-r py-3 font-semibold text-white shadow-sm transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? '儲存中...' : '儲存變更'}
            </button>

            {/* Divider */}
            <div className="my-6 border-t border-gray-700"></div>

            {/* Sync Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-300">
                資料同步
              </h3>

              {/* Last synced time */}
              <p className="mb-3 text-xs text-gray-500">
                {lastSyncedAt
                  ? `上次同步：${formatSyncTime(lastSyncedAt)}`
                  : '尚未同步過'}
              </p>

              {/* Sync progress */}
              {isSyncing && syncProgress && (
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                    <span>{getSyncProgressLabel(syncProgress)}</span>
                    <span>
                      {syncProgress.current}/{syncProgress.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="from-primary-500 to-primary-400 h-full rounded-full bg-linear-to-r transition-all duration-300"
                      style={{
                        width: `${(syncProgress.current / syncProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Success message */}
              {syncSuccess && !isSyncing && (
                <p className="mb-3 text-xs text-green-400">
                  同步完成
                </p>
              )}

              {/* Error message */}
              {syncError && (
                <p className="mb-3 text-xs text-red-400">
                  {syncError}
                </p>
              )}

              {/* Sync button */}
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-600 bg-gray-700/50 py-3 font-semibold text-gray-200 transition-all hover:border-gray-500 hover:bg-gray-700 active:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></div>
                    同步中...
                  </>
                ) : (
                  <>
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    同步資料
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-700"></div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="border-secondary-500 text-secondary-400 hover:bg-secondary-500/10 active:bg-secondary-500/20 w-full rounded-md border-2 py-3 font-semibold transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
