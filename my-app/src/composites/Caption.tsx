'use client';

import { GroupSelector } from '@/composites/GroupSelector';
import { MenuButton } from '@/composites/MenuButton';
import { SettingIcon } from '@/components/icons/SettingIcon';
import { UserAvatar } from '@/components/UserAvatar';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

const WEEKDAY_LABELS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

function getGreetingByHour(hour: number) {
  if (hour >= 5 && hour < 11) return '早安';
  if (hour >= 11 && hour < 14) return '午安';
  if (hour >= 14 && hour < 18) return '午後好';
  return '晚安';
}

export const Caption = ({ openAside }: { openAside: () => void }) => {
  const { config: user } = useUserConfigCtx();
  const [now, setNow] = useState<Date | null>(null);

  // Avoid hydration mismatch — only set the date after mount.
  useEffect(() => {
    setNow(new Date());
  }, []);

  const greetingLabel = useMemo(() => {
    if (!now) return '哈摟';
    return getGreetingByHour(now.getHours());
  }, [now]);

  const dateLabel = useMemo(() => {
    if (!now) return '';
    return `${now.getMonth() + 1} 月 ${now.getDate()} 日 · ${WEEKDAY_LABELS[now.getDay()]}`;
  }, [now]);

  return (
    <div
      className="sticky top-0 left-0 z-40 w-full border-b border-white/[0.06]"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="relative mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:gap-3">
        <div className="flex items-center gap-3">
          <MenuButton openAside={openAside} />

          {/* Mobile greeting — visible mobile only */}
          <Link
            href="/profile"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85 md:hidden"
          >
            <div className="ring-primary-500/30 size-8 shrink-0 overflow-hidden rounded-full ring-2">
              <UserAvatar user={user} />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="text-[15px] font-bold whitespace-nowrap text-gray-100 sm:text-base"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {greetingLabel}，
                <span className="text-primary-400">
                  {user?.name?.split(' ')[0] || '訪客'}
                </span>
              </span>
              {dateLabel && (
                <span className="text-[11px] font-medium text-gray-400">
                  {dateLabel}
                </span>
              )}
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:ml-auto">
          <GroupSelector className="max-w-80 font-bold" />

          {/* Desktop quick-add — mobile uses the BottomNav FAB */}
          <Link
            href="/edit"
            scroll={false}
            className="group btn-add-header hidden md:flex items-center gap-1.5 whitespace-nowrap rounded-[10px] px-3.5 py-2 text-sm font-semibold text-white"
            aria-label="新增帳目"
          >
            <IoMdAdd className="size-[15px] shrink-0 transition-transform duration-200 group-hover:rotate-90" />
            新增帳目
          </Link>

          <Link
            href="/setting"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200 md:hidden"
            aria-label="設定"
          >
            <SettingIcon className="size-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
