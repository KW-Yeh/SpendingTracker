'use client';

import { GroupSelector } from '@/composites/GroupSelector';
import { MenuButton } from '@/composites/MenuButton';
import { UserAvatar } from '@/components/UserAvatar';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import Link from 'next/link';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  const { config: user } = useUserConfigCtx();

  return (
    <div className="sticky top-0 left-0 z-40 w-full border-b border-gray-700/50 bg-gray-800/90 shadow-lg backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <MenuButton openAside={openAside} />

        {/* Mobile Avatar and Greeting - only visible on mobile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 transition-all duration-200 hover:opacity-80 md:hidden"
        >
          <div className="ring-primary-500/30 size-9 shrink-0 overflow-hidden rounded-full ring-2">
            <UserAvatar user={user} />
          </div>
          <span className="text-sm font-semibold whitespace-nowrap text-gray-100">
            哈摟，
            <span className="text-primary-400">{user?.name || '訪客'}</span>！
          </span>
        </Link>

        {/* Group Selector - moved to the right */}
        <div className="ml-auto">
          <GroupSelector className="max-w-80 font-bold" />
        </div>
      </div>
    </div>
  );
};
