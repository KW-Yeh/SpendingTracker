import { MenuIcon } from '@/components/icons/MenuIcon';

interface Props {
  openAside: () => void;
}

export const MenuButton = (props: Props) => {
  const { openAside } = props;
  return (
    <button
      onClick={openAside}
      className="size-8 rounded-full p-1 transition-colors hover:bg-primary-300"
    >
      <MenuIcon className="size-full" />
    </button>
  );
};
