import { cn } from "@workspace/ui/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("animate-pulse bg-foreground/10", className)} {...props} />;
}

export { Skeleton };
