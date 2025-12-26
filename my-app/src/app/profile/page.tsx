'use client';

import { UserAvatar } from '@/components/UserAvatar';
import { ImageCropper } from '@/components/ImageCropper';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, ChangeEvent } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { config: user, setter: setUser } = useUserConfigCtx();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 驗證檔案類型
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片檔案');
      return;
    }

    // 驗證檔案大小 (限制 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('圖片檔案不可超過 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // 將圖片轉換為 base64 並開啟裁剪器
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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">載入中...</p>
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

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
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
            <h1 className="text-lg font-bold">個人資料</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Avatar Section */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="size-24 overflow-hidden rounded-full">
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
              className="text-primary-500 hover:text-primary-600 text-sm font-semibold disabled:opacity-50"
            >
              {isUploading ? '上傳中...' : '更換頭像'}
            </button>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              名稱
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
              placeholder="請輸入名稱"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="bg-primary-500 hover:bg-primary-600 mb-4 w-full rounded-md py-3 font-semibold text-white transition-colors disabled:opacity-50"
          >
            {isSaving ? '儲存中...' : '儲存變更'}
          </button>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full rounded-md border border-red-500 py-3 font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            登出
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
