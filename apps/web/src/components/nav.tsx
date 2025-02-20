import type { FC } from "react";
import { Logo } from "./logo";
import { OrgSwitch } from "./org-switch";
import { UserProfile } from "./user-profile";

export const Nav: FC = () => {
	return (
		<div className="flex flex-grow items-center justify-between">
			<div className="flex h-full items-stretch">
				<div className="flex items-center border-border border-r px-8">
					<Logo />
				</div>
				<div className="flex items-center border-border border-r">
					<OrgSwitch />
				</div>
			</div>
			<div className="flex h-full items-stretch">
				<UserProfile />
			</div>
		</div>
	);
};
