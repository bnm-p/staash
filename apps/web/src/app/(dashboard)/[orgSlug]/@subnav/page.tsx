"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type FC, useEffect, useState } from "react";

const tabs = [
	{ path: "/", name: "Overview" },
	{ path: "/members", name: "Members" },
	{ path: "/settings", name: "Settings" },
] as const;

const OrgSubnav: FC = () => {
	const [activePath, setActivePath] = useState<string>(tabs[0].path);
	const [hoveredPath, setHoveredPath] = useState<string | null>(null);

	const pathname = usePathname();
	const router = useRouter();
	const params = useParams<{ orgSlug: string }>();

	const base = `${params.orgSlug}`;

	useEffect(() => {
		if (tabs.find((tab) => pathname === `/${base}`)) {
			setActivePath(tabs[0].path);
			return;
		}
		const activeTab = tabs.find((tab) => pathname.startsWith(`/${base}/${tab.path}`));
		if (activeTab) {
			setActivePath(activeTab.path);
		}
	}, [pathname, base]);

	const handleClick = (path: string) => {
		setActivePath(path);
		router.push(`/${base}/${path}`);
	};

	return (
		<div className="sticky top-0 z-50 flex h-12 items-center border-border border-b bg-background pr-8 pl-5">
			<div className="flex h-full" onMouseLeave={() => setHoveredPath(null)}>
				{tabs.map((tab) => (
					<button
						key={tab.path}
						type="button"
						onClick={() => handleClick(tab.path)}
						onMouseEnter={() => setHoveredPath(tab.path)}
						className={cn("group relative h-full transition")}
					>
						<span
							className="relative px-3 py-1.5 font-medium text-sm text-white outline-sky-400"
							style={{ WebkitTapHighlightColor: "transparent" }}
						>
							{hoveredPath === tab.path && (
								<motion.span
									layoutId="bubble"
									className="absolute inset-0 rounded-md bg-muted opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
									transition={{ ease: [0.65, 0.05, 0, 1], duration: 0.275 }}
								/>
							)}
							<span className="relative z-10">{tab.name}</span>
						</span>
						{activePath === tab.path && (
							<motion.span
								layoutId="line"
								className="absolute inset-x-0 bottom-0 h-px bg-white"
								transition={{ ease: [0.65, 0.05, 0, 1], duration: 0.275 }}
							/>
						)}
					</button>
				))}
			</div>
		</div>
	);
};

export default OrgSubnav;
