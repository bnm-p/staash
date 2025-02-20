import type { FC } from "react";
import { Logo } from "./logo";
import { OrgSwitch } from "./org-switch";
import { UserProfile } from "./user-profile";

export const Nav: FC = () => {
	return (
		<div className="flex-grow flex items-center justify-between">
			<div className="flex items-stretch h-full">
				<div className="px-8 border-r border-border flex items-center">
					<Logo />
				</div>
				<div className="border-r border-border flex items-center">
					<OrgSwitch />
				</div>
			</div>
			<div className="flex items-stretch h-full">
				<UserProfile />
			</div>
		</div>
	);
};
