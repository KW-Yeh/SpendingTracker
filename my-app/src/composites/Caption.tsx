import { GroupSelector } from '@/composites/GroupSelector';
import { MenuButton } from '@/composites/MenuButton';
import { signOut } from 'next-auth/react';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  return (
    <div className="sticky top-0 left-0 z-40 w-full bg-white/50 p-4 shadow backdrop-blur">
      <div className="relative flex items-center">
        <MenuButton openAside={openAside} />
        <div className="mx-auto">
          <GroupSelector className="border-0 max-w-80" />
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          if (confirm('確定要登出嗎？')) {
            await signOut();
          }
        }}
        className="md:hidden absolute right-0 top-0 text-text flex shrink-0 items-center justify-center rounded-md p-2 text-xs font-semibold transition-all hover:text-red-500 active:text-red-500"
      >
        <span className="text-xs">登出</span>
      </button>
    </div>
  );
};
