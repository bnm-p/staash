"use client";

import { cn } from "@workspace/ui/lib/utils";
import type { Space } from "@prisma/client";
import type { FC } from "react";
import { Container, Shield, Variable } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export interface ISpaceCardProps extends React.ComponentProps<"div"> {
	space: Space;
	index: number;
}

export const SpaceCard: FC<ISpaceCardProps> = ({ className, space, index, ...props }) => {
	const params = useParams();

	return (
		<Link
			href={`/orgs/${params.orgSlug}/spaces/${space.slug}`}
			className={cn("border-border border-b", index % 2 === 0 ? "border-r" : "", className)}
		>
			<div className="flex items-end gap-4 px-8 py-6">
				<div className="h-12 w-12 border border-border bg-muted" />
				<p className="text-xl">{space.name}</p>
			</div>
			<div className="grid grid-cols-3 gap-4 border-muted border-t px-8 py-6 pt-6 ">
				<div className="space-y-2">
					<div className="text-2xl">12</div>
					<div className="flex items-center gap-x-2 text-muted-foreground text-xs">
						<Container className="size-4" />
						<p>Environments</p>
					</div>
				</div>
				<div className="space-y-2">
					<div className="text-2xl">12</div>
					<div className="flex items-center gap-x-2 text-muted-foreground text-xs">
						<Shield className="size-4" />
						<p>Secrets</p>
					</div>
				</div>
				<div className="space-y-2">
					<div className="text-2xl">12</div>
					<div className="flex items-center gap-x-2 text-muted-foreground text-xs">
						<Variable className="size-4" />
						<p>Variables</p>
					</div>
				</div>
			</div>
		</Link>
	);
};
