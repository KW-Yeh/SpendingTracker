import { MenuButton } from "@/composites/MenuButton";
import { RouteTitle } from "@/components/RouteTitle";

export const Header = () => {
  return (
    <div className="sticky w-full left-0 top-0 z-40 p-6 border-b border-solid border-text">
      <div className="flex items-center">
        <MenuButton />
        <div className="flex-1 flex justify-center">
          <RouteTitle />
        </div>
      </div>
    </div>
  );
};
