import { MenuIcon } from '@/components/icons/MenuIcon';
import { signOut } from 'next-auth/react';

interface Props {
  openAside: () => void;
}

export const MenuButton = (props: Props) => {
  const { openAside } = props;
  return (
    <>
      <button
      onClick={openAside}
      className="size-8 max-md:hidden rounded-full p-1 transition-colors hover:bg-primary-100 active:bg-primary-100"
    >
      <MenuIcon className="size-full" />
    </button>
    <button
      type="button"
      onClick={async () => {
        if (confirm('確定要登出嗎？')) {
          await signOut();
        }
      }}
      className="bg-background md:hidden text-text flex shrink-0 items-center justify-center rounded-md p-2 text-xs font-semibold transition-all hover:text-red-500 active:text-red-500"
    >
      <span className="text-xs">登出</span>
    </button>
    </>
  );
};
