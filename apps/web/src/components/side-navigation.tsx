"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { type FC, useEffect, useState } from "react";

interface ISideNavigationProps extends React.ComponentProps<"aside"> {
	items: { path: string; label: string }[];
	base: string;
}

export const SideNavigation: FC<ISideNavigationProps> = ({ items, base, className, ...props }) => {
	const [activePath, setActivePath] = useState<string>(items[0].path);
	const [hoveredPath, setHoveredPath] = useState<string | null>(null);

	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (!pathname) return;

		// Remove the base segment from the pathname.
		let relativePath = pathname.replace(new RegExp(`^${base}`), "");
		// Default to the first item if relative path is empty.
		if (relativePath === "" || relativePath === "/") {
			setActivePath(items[0].path);
			return;
		}

		// Sort items by descending path length so that more specific routes match first.
		const sortedItems = [...items].sort((a, b) => b.path.length - a.path.length);
		const matchedItem = sortedItems.find((item) => relativePath === item.path || relativePath.startsWith(`${item.path}/`));
		setActivePath(matchedItem ? matchedItem.path : items[0].path);
	}, [pathname, items, base]);

	const handleClick = (path: string) => {
		setActivePath(path);
		router.push(`${base}${path === "/" ? "" : path}`);
	};

	return (
		<aside className={cn("flex w-60 flex-col items-start", className)} {...props} onMouseLeave={() => setHoveredPath(null)}>
			{items.map((item) => (
				<button
					key={item.path}
					type="button"
					onClick={() => handleClick(item.path)}
					onMouseEnter={() => setHoveredPath(item.path)}
					className={cn("group relative w-full text-left", activePath === item.path && "font-bold")}
				>
					<span
						className="relative block px-3 py-1.5 text-sm text-white outline-sky-400"
						style={{ WebkitTapHighlightColor: "transparent" }}
					>
						{hoveredPath === item.path && (
							<motion.span
								layoutId="sidenav-bubble"
								className="absolute inset-0 rounded-md bg-muted opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
								transition={{ ease: [0.65, 0.05, 0, 1], duration: 0.275 }}
							/>
						)}
						<span className="relative z-10">{item.label}</span>
					</span>
				</button>
			))}
		</aside>
	);
};
