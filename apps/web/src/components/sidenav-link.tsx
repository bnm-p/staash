import type { FC } from "react";

export const SideNavLink: FC = () => {
	return (
		<div className="h-screen w-52 border-r">
			<div className="divide-y divide-border border-border border-b">
				<a href="/spaces" className="block p-2 pl-8">
					Spaces
				</a>
				<a href="/members" className="block p-2 pl-8">
					Members
				</a>
				<a href="/settings" className="block p-2 pl-8">
					Settings
				</a>
			</div>
		</div>
	);
};
