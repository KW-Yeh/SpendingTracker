import { RouteTitle } from '@/components/RouteTitle';
import { GroupSelector } from '@/composites/GroupSelector';
import { MenuButton } from '@/composites/MenuButton';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  return (
    <div className="sticky top-0 left-0 z-40 w-full p-4 shadow backdrop-blur">
      <div className="relative flex items-center">
        <MenuButton openAside={openAside} />
        <div className="flex flex-1 justify-center pr-8">
          <RouteTitle />
        </div>
        <div className="absolute right-0 w-fit">
          <GroupSelector />
        </div>
      </div>
    </div>
  );
};
