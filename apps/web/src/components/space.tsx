"use client";

import { useDrawer } from "@/hooks/use-drawer";
import { useModal } from "@/hooks/use-modal";
import type { Organization, Space as TSpace } from "@prisma/client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { Edit2, EllipsisVertical, SquareSlash } from "lucide-react";
import { useCallback, type FC } from "react";
import { Logo } from "./icons";
import { RelativeTime } from "./relative-time";
import Link from "next/link";

interface ISpaceProps {
	variant: "grid" | "list";
	org: Organization;
	space: TSpace;
}

export const Space: FC<ISpaceProps> = ({ variant, org, space }) => {
	const modal = useModal();
	const drawer = useDrawer();

	const handleDelete = useCallback(() => {
		modal.onOpen("delete-space", { org, space });
	}, [modal, org, space]);

	const handleEdit = useCallback(() => {
		drawer.onOpen("edit-space", { org, space });
	}, [drawer, org, space]);

	return (
		<li key={`${space.id}-list`}>
			<Card className="relative bg-black p-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="absolute top-4 right-4">
							<EllipsisVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={handleEdit}>
							<Edit2 className="h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={handleDelete} className="!text-destructive hover:!bg-destructive/25">
							<SquareSlash className="h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Link href={`/${org.slug}/${space.slug}`}>
					{variant === "grid" ? (
						<>
							<div className="rounded-md border border-border bg-background p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
										<Logo name={space.icon} className="size-6" />
										<h4 className="truncate font-medium text-sm">{space.name}</h4>
									</div>
								</div>

								<div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
									<p className="text-muted-foreground text-xs">{space.slug}</p>
									<p className="text-muted-foreground text-xs">8 Secrets · 4 Config Vars</p>
									<p className="text-muted-foreground text-xs">Linked to 3 Services</p>
								</div>

								<div className="mt-4 flex items-center gap-x-2">
									<Badge variant="outline">prod</Badge>
									<Badge variant="outline">dev</Badge>
								</div>
							</div>

							<div className="px-2 pt-4 pb-2">
								<div className="block">
									<div className="flex items-center justify-between">
										<span className="font-medium text-green-500 text-xs">Production Synced</span>
										<p className="text-muted-foreground text-xs">Last edited by Jane Doe</p>
									</div>

									<div className="mt-2 flex items-center justify-between">
										<p className="text-muted-foreground text-xs">
											Updated <RelativeTime date={space.updatedAt} />
										</p>
										<p className="text-muted-foreground text-xs">
											Created <RelativeTime date={space.createdAt} />
										</p>
									</div>
								</div>
							</div>
						</>
					) : (
						<>
							<div className="rounded-md border border-border bg-background p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
										<Logo name={space.icon} className="size-6" />
										<h4 className="truncate font-medium text-sm">{space.name}</h4>
									</div>
								</div>

								<div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
									<p className="text-muted-foreground text-xs">{space.slug}</p>
									<p className="text-muted-foreground text-xs">8 Secrets · 4 Config Vars</p>
									<p className="text-muted-foreground text-xs">Linked to 3 Services</p>
								</div>

								<div className="mt-4 flex items-center gap-x-2">
									<Badge variant="outline">prod</Badge>
									<Badge variant="outline">dev</Badge>
								</div>
							</div>

							<div className="px-2 pt-4 pb-2">
								<div className="block sm:flex sm:items-end sm:justify-between">
									<div className="flex items-center space-x-2">
										<span className="font-medium text-green-500 text-xs">Production Synced</span>
									</div>

									<div className="flex flex-col gap-x-6 sm:flex-row sm:items-center">
										<p className="text-muted-foreground text-xs">Last edited by Jane Doe</p>
										<p className="text-muted-foreground text-xs">
											Updated <RelativeTime date={space.updatedAt} />
										</p>
										<p className="text-muted-foreground text-xs">
											Created <RelativeTime date={space.createdAt} />
										</p>
									</div>
								</div>
							</div>
						</>
					)}
				</Link>
			</Card>
		</li>
	);
};
