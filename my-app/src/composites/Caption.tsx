import { RouteTitle } from '@/components/RouteTitle';
import { MenuButton } from '@/composites/MenuButton';

export const Caption = ({ openAside }: { openAside: () => void }) => {
  return (
    <div className="sticky left-0 top-0 z-40 w-full border-b border-solid border-text p-4 backdrop-blur sm:p-6">
      <div className="flex items-center">
        <MenuButton openAside={openAside} />
        <div className="flex flex-1 justify-center">
          <RouteTitle />
        </div>
      </div>
    </div>
  );
};
