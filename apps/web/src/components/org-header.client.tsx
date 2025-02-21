"use client";

import type { FC } from "react";
import type { IOrgHeaderProps } from "./org-header";
import type { Organization, Space } from "@prisma/client";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { Button } from "@workspace/ui/components/button";

interface IOrgHeaderClientProps extends IOrgHeaderProps {
	organization: Organization;
	space?: Space | null;
}

export const OrgHeaderClient: FC<IOrgHeaderClientProps> = ({ className, organization, space, ...props }) => {
	const router = useRouter();
	const params = useParams<{ orgSlug: string; spaceSlug?: string }>();

	const orgQuery = useQuery({
		queryKey: ["organization", params.orgSlug, "org-header"],
		initialData: organization,
		enabled: !!params.orgSlug,
		queryFn: async () => {
			const res = await client.api.orgs[":orgSlug"].$get({
				param: {
					orgSlug: params.orgSlug,
				},
			});

			const data = await res.json();
			return { ...data, createdAt: new Date(data.createdAt) };
		},
	});

	const spaceQuery = useQuery({
		queryKey: ["space", params.spaceSlug, "org-header"],
		initialData: space,
		enabled: !!params.spaceSlug,
		queryFn: async () => {
			if (!params.spaceSlug) return null;

			const res = await client.api.orgs[":orgSlug"].spaces[":spaceSlug"].$get({
				param: {
					orgSlug: params.orgSlug,
					spaceSlug: params.spaceSlug,
				},
			});

			const data = await res.json();
			return data ? { ...data, createdAt: new Date(data.createdAt) } : null;
		},
	});

	const handleBack = () => {
		router.refresh();
		router.push(`/orgs/${orgQuery.data.slug}`);
	};

	return (
		<div
			className={cn("background-stripes animate | relative flex h-32 items-end border-border border-b px-8 py-6", className)}
			{...props}
		>
			<div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
			<div className="relative z-10 space-y-1.5">
				{spaceQuery.data ? (
					<>
						<button type="button" onClick={handleBack} className="flex items-center gap-x-2 text-muted-foreground">
							<ChevronLeft className="h-4 w-4" />
							{orgQuery.data.name}
						</button>
						<p className="text-4xl">{spaceQuery.data.name}</p>
					</>
				) : (
					<p className="flex items-center gap-x-2 text-4xl">
						<ChevronLeft className="mr-2 hidden h-4 w-4 opacity-0" />
						{orgQuery.data.name}
					</p>
				)}
			</div>
		</div>
	);
};
