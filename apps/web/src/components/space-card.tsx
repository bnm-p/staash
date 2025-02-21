import { cn } from "@workspace/ui/lib/utils";
import type { Space } from "@prisma/client";
import type { FC } from "react";
import { Container, Shield, Variable } from "lucide-react";

export interface ISpaceCardProps extends React.ComponentProps<"div"> {
	space: Space;
	index: number;
}

export const SpaceCard: FC<ISpaceCardProps> = ({ className, space, index, ...props }) => {
	return (
		<div className={cn("border-border border-b p-6", index % 2 === 0 ? "border-r" : "", className)}>
			<div className="flex">
				<div className="h-12 w-12 bg-red-500" />
				<p className="flex items-end pl-6 text-xl">{space.name}</p>
			</div>
			<div className="grid grid-cols-3 gap-4 pt-4">
				<div>
					<div className="text-2xl">12</div>
					<div className="flex pt-4">
						<Container color="gray" />
						<div className="pl-2 text-gray-400">Members</div>
					</div>
				</div>
				<div>
					<div className="text-2xl">12</div>
					<div className="flex pt-4">
						<Shield color="gray" />
						<div className="pl-2 text-gray-400">Members</div>
					</div>
				</div>
				<div>
					<div className="text-2xl">12</div>
					<div className="flex pt-4">
						<Variable color="gray" />
						<div className="pl-2 text-gray-400">Members</div>
					</div>
				</div>
			</div>
		</div>
	);
};
