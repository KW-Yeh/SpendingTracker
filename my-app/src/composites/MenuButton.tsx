import { MenuIcon } from '@/components/icons/MenuIcon';

interface Props {
  openAside: () => void;
}

export const MenuButton = (props: Props) => {
  const { openAside } = props;
  return (
      <button
      onClick={openAside}
      className="min-w-[44px] min-h-[44px] rounded-full p-2 transition-all duration-200 hover:bg-primary-100 hover:text-primary-600 active:bg-primary-200 max-md:hidden"
      aria-label="Open menu"
    >
      <MenuIcon className="size-6" />
    </button>
  );
};
