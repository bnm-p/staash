"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { type FC, useEffect, useState } from "react";

interface ISideNavigationProps extends React.ComponentProps<"aside"> {
	items: { path: string; label: string }[];
}

export const SideNavigation: FC<ISideNavigationProps> = ({ items, className, ...props }) => {
	const [activePath, setActivePath] = useState<string>("");
	const [hoveredPath, setHoveredPath] = useState<string | null>(null);

	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		const activeTab = items.find((tab) => pathname.startsWith(tab.path));
		if (activeTab) {
			setActivePath(activeTab.path);
		}
	}, [pathname, items]);

	const handleClick = (path: string) => {
		setActivePath(path);
		router.push(path);
	};

	return (
		<aside className={cn("flex w-60 flex-col items-start", className)} {...props} onMouseLeave={() => setHoveredPath(null)}>
			{items.map((item) => (
				<button
					key={item.path}
					type="button"
					onClick={() => handleClick(item.path)}
					onMouseEnter={() => setHoveredPath(item.path)}
					className={cn("group relative w-full text-left transition", activePath === item.path && "font-semibold")}
				>
					<span
						className="relative block px-3 py-1.5 text-sm text-white outline-sky-400"
						style={{ WebkitTapHighlightColor: "transparent" }}
					>
						{hoveredPath === item.path && (
							<motion.span
								layoutId="bubble"
								className="absolute inset-0 rounded-md bg-muted opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
								transition={{ ease: [0.65, 0.05, 0, 1], duration: 0.275 }}
							/>
						)}
						<span className="relative z-10">{item.label}</span>
					</span>
					{activePath === item.path && (
						<motion.span
							layoutId="line"
							className="absolute inset-y-0 left-0 z-10 w-px bg-white"
							transition={{ ease: [0.65, 0.05, 0, 1], duration: 0.275 }}
						/>
					)}
				</button>
			))}
		</aside>
	);
};
