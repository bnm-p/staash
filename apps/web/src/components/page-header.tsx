import { cn } from "@workspace/ui/lib/utils";
import type { FC } from "react";
import type React from "react";

interface IPageHeaderProps extends React.ComponentProps<"div"> {
	title: string;
}

export const PageHeader: FC<IPageHeaderProps> = ({ title, className, ...props }) => {
	return (
		<div className={cn("flex h-32 w-full items-center border-border border-b", className)} {...props}>
			<div className="container mx-auto">
				<h1>{title}</h1>
			</div>
		</div>
	);
};
