import { MenuButton } from "@/composites/MenuButton";
import { RouteTitle } from "@/components/RouteTitle";

export const Header = () => {
	return (
		<div className="sticky left-0 top-0 z-40 w-full border-b border-solid border-text p-4 sm:p-6 bg-background">
			<div className="flex items-center">
				<MenuButton/>
				<div className="flex flex-1 justify-center">
					<RouteTitle/>
				</div>
			</div>
		</div>
	);
};
