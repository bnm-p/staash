import type { FC } from "react";
import { Logo } from "./logo";

interface IFooterProps extends React.ComponentProps<"footer"> {}

export const Footer: FC<IFooterProps> = ({ className, ...props }) => {
	return (
		<footer className="w-full border-border border-t px-8">
			<div className="flex h-16 items-center justify-between px-8">
				<div className="flex h-full items-center gap-x-8">
					<Logo />
					<span className="text-muted-foreground text-xs">&copy; 2025</span>
					<span className="flex items-center gap-x-2">
						<div className="size-3 rounded-sm bg-emerald-500" />
						<span className="text-xs">All systems operational</span>
					</span>
				</div>
				<div className="flex h-full items-center gap-x-8"></div>
			</div>
		</footer>
	);
};
