'use client';

import { GroupSelector } from '@/composites/GroupSelector';
import { MenuButton } from '@/composites/MenuButton';
import { UserAvatar } from '@/components/UserAvatar';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import Link from 'next/link';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  const { config: user } = useUserConfigCtx();

  return (
    <div className="sticky top-0 left-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="relative flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
        <MenuButton openAside={openAside} />

        {/* Mobile Avatar and Greeting - only visible on mobile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 md:hidden transition-all duration-200 hover:opacity-80"
        >
          <div className="size-9 shrink-0 rounded-full ring-2 ring-primary-100 overflow-hidden">
            <UserAvatar user={user} />
          </div>
          <span className="text-sm font-semibold whitespace-nowrap text-gray-800">
            哈摟，<span className="text-primary-600">{user?.name || '訪客'}</span>！
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
