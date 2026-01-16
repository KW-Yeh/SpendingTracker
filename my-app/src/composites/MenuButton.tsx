import { MenuIcon } from '@/components/icons/MenuIcon';

interface Props {
  openAside: () => void;
}

export const MenuButton = (props: Props) => {
  const { openAside } = props;
  return (
    <button
      onClick={openAside}
      className="hover:bg-primary-100 hover:text-primary-600 active:bg-primary-200 min-h-11 min-w-11 rounded-full p-2 transition-all duration-200 max-md:hidden"
      aria-label="Open menu"
    >
      <MenuIcon className="size-6" />
    </button>
  );
};
