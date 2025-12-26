'use client';

import { GroupSelector } from '@/composites/GroupSelector';
import { MenuButton } from '@/composites/MenuButton';
import { UserAvatar } from '@/components/UserAvatar';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import Link from 'next/link';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  const { config: user } = useUserConfigCtx();

  return (
    <div className="sticky top-0 left-0 z-40 w-full bg-white/50 p-4 shadow backdrop-blur">
      <div className="relative flex items-center gap-3">
        <MenuButton openAside={openAside} />

        {/* Mobile Avatar and Greeting - only visible on mobile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 md:hidden"
        >
          <div className="size-8 shrink-0">
            <UserAvatar user={user} />
          </div>
          <span className="text-sm font-semibold whitespace-nowrap">
            哈摟，{user?.name || '訪客'}！
          </span>
        </Link>

        {/* Center title - only visible on desktop */}
        <h2 className="text-sm font-bold whitespace-nowrap md:mx-auto hidden md:block">
          帳本
        </h2>

        {/* Group Selector - moved to the right */}
        <div className="ml-auto">
          <GroupSelector className="max-w-80 font-bold" />
        </div>
      </div>
    </div>
  );
};
