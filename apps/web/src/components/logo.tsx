import { cn } from "@workspace/ui/lib/utils";
import type { FC } from "react";

interface ILogoProps extends React.ComponentProps<"div"> {}

export const Logo: FC<ILogoProps> = ({ className, ...props }) => {
	return (
		<div className={cn("flex items-center gap-x-2", className)} {...props}>
			<svg width="46" height="22" viewBox="0 0 46 22" fill="none" xmlns="http://www.w3.org/2000/svg">
				<title>Staash</title>
				<path d="M25.0909 7.33333H33.4545L29.2727 14.6667L25.0909 7.33333Z" fill="white" />
				<path d="M20.9091 14.6667H12.5455L16.7273 7.33333L20.9091 14.6667Z" fill="white" />
				<path d="M37.6364 14.6667H29.2727L33.4545 7.33333L37.6364 14.6667Z" fill="white" />
				<path d="M37.6364 14.6667H29.2727L33.4545 7.33333L37.6364 14.6667Z" fill="white" />
				<path d="M8.36364 7.33333L16.7273 7.33333L12.5455 14.6667L8.36364 7.33333Z" fill="white" />
				<path d="M29.2727 14.6667H37.6364L33.4545 22L29.2727 14.6667Z" fill="white" />
				<path d="M16.7273 7.33333L8.36364 7.33333L12.5455 0L16.7273 7.33333Z" fill="white" />
				<path d="M37.6364 3.66343e-07H46L41.8182 7.33333L37.6364 3.66343e-07Z" fill="white" />
				<path d="M8.36364 22H0L4.18182 14.6667L8.36364 22Z" fill="white" />
				<path d="M33.4545 22H25.0909L29.2727 14.6667L33.4545 22Z" fill="white" />
				<path d="M12.5455 0L20.9091 1.83172e-06L16.7273 7.33333L12.5455 0Z" fill="white" />
				<path d="M41.8182 7.33333H33.4545L37.6364 3.66343e-07L41.8182 7.33333Z" fill="white" />
				<path d="M4.18182 14.6667H12.5455L8.36364 22L4.18182 14.6667Z" fill="white" />
			</svg>
		</div>
	);
};
