"use client";

import type { FC } from "react";
import type { Organization, Space as TSpace } from "@prisma/client";
import { Logo } from "@/components/icons";
import { RelativeTime } from "@/components/relative-time";
import { Badge } from "@workspace/ui/components/badge";
import { VariableManager } from "@/components/variable-manager";
import { AuditLog } from "@/components/audit-log";

interface ISpaceSlugClientPageProps {
	org: Organization;
	space: TSpace;
}

export const SpaceSlugClientPage: FC<ISpaceSlugClientPageProps> = ({ org, space }) => {
	return (
		<div>
			<div className="grid grid-cols-2 gap-x-8">
				<div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
					<Logo name={space.icon} className="size-12" />
					<div className="-space-y-1">
						<p className="text-lg">{space.name}</p>
						<p className="text-muted-foreground text-sm">
							staash.app/{org.slug}/{space.slug}
						</p>
					</div>
				</div>
				<div className="mt-4 flex items-center gap-x-2">
					<Badge variant="outline">prod</Badge>
					<Badge variant="outline">dev</Badge>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-x-8">
				<div className="flex items-center space-x-2">
					<div className="-space-x-2 flex">
						<img
							src="https://i.pravatar.cc/24?img=1"
							alt="User 1"
							className="inline-block size-6 rounded-full ring-2 ring-background"
						/>
						<img
							src="https://i.pravatar.cc/24?img=2"
							alt="User 2"
							className="inline-block size-6 rounded-full ring-2 ring-background"
						/>
						<img
							src="https://i.pravatar.cc/24?img=3"
							alt="User 3"
							className="inline-block size-6 rounded-full ring-2 ring-background"
						/>
					</div>
					<span className="font-medium text-green-500 text-xs">Synced</span>
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
			<div className="mt-12 flex gap-x-8">
				<div className="h-fit w-full">
					<VariableManager />
				</div>
				<div className="h-fit w-full">
					<AuditLog
						logs={[
							{
								id: "1",
								type: "VARIABLE_UPDATED",
								actor: "Alice",
								description: "updated `STRIPE_SECRET_KEY` in `production`",
								timestamp: "2025-05-21T12:30:00Z",
							},
							{
								id: "2",
								type: "USER_INVITED",
								actor: "Bob",
								description: "invited `carol@example.com` to the space",
								timestamp: "2025-05-20T09:15:00Z",
							},
							{
								id: "3",
								type: "STAGE_CREATED",
								actor: "Alice",
								description: "created `staging` stage",
								timestamp: "2025-05-19T14:45:00Z",
							},
							{
								id: "4",
								type: "VARIABLE_UPDATED",
								actor: "Alice",
								description: "updated `STRIPE_SECRET_KEY` in `production`",
								timestamp: "2025-05-18T12:30:00Z",
							},
							{
								id: "5",
								type: "USER_INVITED",
								actor: "Bob",
								description: "invited `carol@example.com` to the space",
								timestamp: "2025-05-17T09:15:00Z",
							},
							{
								id: "6",
								type: "STAGE_CREATED",
								actor: "Alice",
								description: "created `staging` stage",
								timestamp: "2025-05-16T14:45:00Z",
							},
							{
								id: "7",
								type: "VARIABLE_UPDATED",
								actor: "Alice",
								description: "updated `STRIPE_SECRET_KEY` in `production`",
								timestamp: "2025-05-15T12:30:00Z",
							},
							{
								id: "8",
								type: "USER_INVITED",
								actor: "Bob",
								description: "invited `carol@example.com` to the space",
								timestamp: "2025-05-14T09:15:00Z",
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
};
