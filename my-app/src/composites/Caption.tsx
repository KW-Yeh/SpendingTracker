import { GroupSelector } from '@/composites/GroupSelector';
import { MenuButton } from '@/composites/MenuButton';
import { signOut } from 'next-auth/react';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  return (
    <div className="sticky top-0 left-0 z-40 w-full bg-white/50 p-4 shadow backdrop-blur">
      <div className="relative flex items-center">
        <MenuButton openAside={openAside} />
        <div className="mx-auto flex items-center gap-4">
          <h2 className="text-sm font-bold whitespace-nowrap">帳本</h2>
          <GroupSelector className="max-w-80 font-bold" />
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          if (confirm('確定要登出嗎？')) {
            await signOut();
          }
        }}
        className="absolute top-0 right-0 flex shrink-0 items-center justify-center rounded-md p-2 text-xs font-semibold text-gray-500 transition-all hover:text-red-500 active:text-red-500 md:hidden"
      >
        <span className="text-xs">登出</span>
      </button>
    </div>
  );
};
