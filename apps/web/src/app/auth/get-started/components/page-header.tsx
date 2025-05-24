import { cn } from "@workspace/ui/lib/utils";
import type { ComponentProps, FC } from "react";

interface IPageHeaderProps extends ComponentProps<"div"> {
	title: string;
	description?: string;
}

export const PageHeader: FC<IPageHeaderProps> = ({ title, className, description, ...props }) => {
	return (
		<div className={cn("max-w-md space-y-2.5", className)} {...props}>
			<h1 className="text-4xl tracking-tight">{title}</h1>
			<p className="text-lg text-muted-foreground">{description}</p>
		</div>
	);
};
