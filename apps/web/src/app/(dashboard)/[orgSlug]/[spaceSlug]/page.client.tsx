"use client";

import type { FC } from "react";
import type { Organization, Space as TSpace } from "@prisma/client";
import { Logo } from "@/components/icons";
import { RelativeTime } from "@/components/relative-time";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";

interface ISpaceSlugClientPageProps {
	org: Organization;
	space: TSpace;
}

const variables = [
	{
		key: "DATABASE_URL",
		value: "postgresql://user:password@localhost:5432/db-name",
		type: "string",
		stages: ["prod", "dev"],
		secret: true,
	},
	{
		key: "NEXT_PUBLIC_API_URL",
		value: "https://api.example.com",
		type: "string",
		stages: ["prod"],
		secret: false,
	},
	{
		key: "USE_AUTO_MIGRATE",
		value: "true",
		type: "boolean",
		stages: ["dev"],
		secret: false,
	},
];

export const SpaceSlugClientPage: FC<ISpaceSlugClientPageProps> = ({ org, space }) => {
	return (
		<div>
			<div className="grid grid-cols-2">
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
			<div className="mt-4 grid grid-cols-2">
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
			<div className="mt-12">
				<div className="mt-4">
					{variables.map((variable) => (
						<div key={variable.key} className="grid grid-cols-[33%_1fr_33%] items-center border-b border-border p-4">
							<div className="flex items-center gap-x-4">
								<div className="flex flex-col">
									<p className="text-muted-foreground text-xs">{variable.type}</p>
									<p className="font-sm">{variable.key}</p>
								</div>
							</div>
							<div>
								{variable.secret ? (
									<span className="text-muted-foreground text-lg tracking-widest">••••••••••••••••••••••••••••••</span>
								) : (
									<span className="text-muted-foreground text-sm">
										{variable.type === "string" ? (
											`${variable.value}`
										) : variable.type === "boolean" ? (
											<Badge variant={"outline"}>{variable.value}</Badge>
										) : (
											variable.value
										)}
									</span>
								)}
							</div>
							<div className="flex items-center justify-end gap-x-2">
								{variable.stages.map((stage) => (
									<Badge key={stage} variant="outline">
										{stage}
									</Badge>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
