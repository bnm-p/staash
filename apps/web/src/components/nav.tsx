import type { FC } from "react";
import { Logo } from "./logo";
import { OrgSwitch } from "./org-switch";
import { UserProfile } from "./user-profile";

export const Nav: FC = () => {
	return (
		<div className="flex h-16 items-center justify-between px-8">
			<div className="flex h-full items-center gap-x-8">
				<Logo />
				<span className="h-6 w-px rotate-12 bg-border" />
				<OrgSwitch />
			</div>
			<div className="flex h-full items-center gap-x-8">
				<UserProfile />
			</div>
		</div>
	);
};
