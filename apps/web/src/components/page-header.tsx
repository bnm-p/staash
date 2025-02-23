"use client";

import { useEffect, type FC } from "react";
import { cn } from "@workspace/ui/lib/utils";
import type React from "react";
import useScrollPosition from "@react-hook/window-scroll";
import { useRange } from "@/hooks/use-range";

interface IPageHeaderProps extends React.ComponentProps<"div"> {
	title: string;
}

export const PageHeader: FC<IPageHeaderProps> = ({ title, className, ...props }) => {
	const y = useScrollPosition(60);
	const navHeight = useRange(y, 0, 50, 112, 64);
	const textScale = useRange(y, 0, 50, 1, 0.5);

	return (
		<div
			className={cn("sticky top-0 flex h-16 w-full items-center border-border border-b", className)}
			style={{ height: `${navHeight}px` }}
			{...props}
		>
			<div className="container">
				<h1 className="origin-[center_left]" style={{ transform: `scale(${textScale})` }}>
					{title}
				</h1>
			</div>
		</div>
	);
};
