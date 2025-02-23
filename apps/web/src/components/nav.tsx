import type { FC } from "react";
import { Logo } from "./logo";
import { OrgSwitch } from "./org-switch";
import { UserProfile } from "./user-profile";
import Link from "next/link";

interface NavProps {
	showOrgSwitch?: boolean;
}

export const Nav: FC<NavProps> = ({ showOrgSwitch = true }) => {
	return (
		<div className="flex h-16 items-center justify-between px-8">
			<div className="flex h-full items-center gap-x-8">
				<Link href="/">
					<Logo />
				</Link>
				{showOrgSwitch && (
					<>
						<span className="h-6 w-px rotate-12 bg-border" />
						<OrgSwitch />
					</>
				)}
			</div>
			<div className="flex h-full items-center gap-x-8">
				<UserProfile />
			</div>
		</div>
	);
};
