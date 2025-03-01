import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

interface SlugInputProps extends React.ComponentProps<"input"> {
	prefix: string;
}

const SlugInput = React.forwardRef<HTMLInputElement, SlugInputProps>(({ className, type, ...props }, ref) => {
	return (
		<label className={cn("flex", className)}>
			<p
				className="relative flex max-w-[120px] items-center justify-end truncate rounded-l-md border border-border bg-muted px-4 text-right text-muted-foreground text-sm"
				title={props.prefix}
			>
				<span className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-muted to-transparent" />
				{props.prefix}
			</p>
			<input
				type={type}
				className="flex h-9 w-full rounded-md rounded-l-none border border-input border-l-0 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
				ref={ref}
				{...props}
			/>
		</label>
	);
});
SlugInput.displayName = "SlugInput";

export { SlugInput };
