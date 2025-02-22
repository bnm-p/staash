import type { FC } from "react";

const categories = [
	{ name: "Overview", path: "/overview" },
	{ name: "Members", path: "/members" },
	{ name: "Settings", path: "/settings" },
	{ name: "Support", path: "/support" },
	{ name: "Reports", path: "/reports" },
	{ name: "Analytics", path: "/analytics" },
	{ name: "Integrations", path: "/integrations" },
];

export const SubNav: FC = () => {
	return (
		<div className="flex flex-grow">
			<div className="flex w-full text-sm">
				{categories.map((category) => (
					<a
						key={category.name}
						href={category.path}
						className="flex flex-grow items-center justify-center border-border border-r border-b px-8 hover:bg-muted"
					>
						<p>{category.name}</p>
					</a>
				))}
			</div>
		</div>
	);
};
