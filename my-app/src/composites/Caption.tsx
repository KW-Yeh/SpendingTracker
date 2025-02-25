import { RouteTitle } from '@/components/RouteTitle';
import { MenuButton } from '@/composites/MenuButton';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  return (
    <div className="sticky left-0 top-0 z-40 w-full p-4 shadow backdrop-blur sm:p-6">
      <div className="flex items-center">
        <MenuButton openAside={openAside} />
        <div className="flex flex-1 justify-center pr-8">
          <RouteTitle />
        </div>
      </div>
    </div>
  );
};
