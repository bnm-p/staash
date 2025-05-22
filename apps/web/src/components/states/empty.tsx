import { cn } from "@workspace/ui/lib/utils";
import { CircleDashed } from "lucide-react";
import type { ComponentProps, FC } from "react";

interface IEmptyStateProps extends ComponentProps<"div"> {
	title: string;
	description: string;
	containerClassName?: string;
}

export const EmptyState: FC<IEmptyStateProps> = ({ className, title, description, containerClassName, children, ...props }) => {
	return (
		<div className={cn("flex w-full flex-col items-center gap-6 p-6", className)} {...props}>
			<div className="flex h-12 w-12 items-center justify-center rounded-md border bg-card p-2 shadow-sm">
				<CircleDashed className="size-6 text-foreground" />
			</div>
			<div className="flex flex-col items-center gap-2 text-center">
				<h2 className="font-semibold text-foreground text-lg md:text-xl">{title}</h2>
				<p className="text-muted-foreground text-sm leading-5">{description}</p>
			</div>
			<div
				className={cn("flex w-full flex-col items-stretch justify-center gap-3 md:flex-row md:items-center", containerClassName)}
			>
				{children}
			</div>
		</div>
	);
};
