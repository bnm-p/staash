"use client";

import { QueryHandler } from "@/components/query-handler";
import { Space } from "@/components/space";
import { EmptyState } from "@/components/states/empty";
import { ErrorState } from "@/components/states/error";
import { useModal } from "@/hooks/use-modal";
import { client } from "@/lib/client";
import type { Organization, Space as TSpace } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Plus } from "lucide-react";
import type { NextPage } from "next";
import { use } from "react";

interface IOrgSlugClientPageProps {
	orgPromise: Promise<Organization>;
}

export const OrgSlugClientPage: NextPage<IOrgSlugClientPageProps> = ({ orgPromise }) => {
	const org = use(orgPromise);

	const { onOpen } = useModal();

	const spacesQuery = useQuery<TSpace[]>({
		queryKey: ["org", org.slug, "spaces"],
		queryFn: async () => {
			const res = await client.api.orgs[":orgSlug"].spaces.$get({ param: { orgSlug: org.slug } });

			const data = await res.json();

			return data.map((space) => ({ ...space, createdAt: new Date(space.createdAt), updatedAt: new Date(space.updatedAt) }));
		},
		enabled: !!org.slug,
	});

	return (
		<div className="space-y-6">
			<div className="flex justify-between">
				<p className="text-2xl">Spaces</p>
				<Button variant={"outline"} onClick={() => onOpen("create-space", { org })}>
					Create Space <Plus />
				</Button>
			</div>
			<QueryHandler
				query={spacesQuery}
				render={({ data }) => (
					<ul className="grid grid-cols-2 gap-4 md:grid-cols-2">
						{data.map((space) => (
							<Space key={space.id} variant={"grid"} org={org} space={space} />
						))}
					</ul>
				)}
				loading={() => (
					<ul className="grid grid-cols-2 gap-4 md:grid-cols-2">
						<li className="h-[210px] rounded-xl border border-border p-2">
							<Skeleton className="h-[128px] rounded-lg" />
						</li>
						<li className="h-[210px] rounded-xl border border-border p-2">
							<Skeleton className="h-[128px] rounded-lg" />
						</li>
						<li className="h-[210px] rounded-xl border border-border p-2">
							<Skeleton className="h-[128px] rounded-lg" />
						</li>
						<li className="h-[210px] rounded-xl border border-border p-2">
							<Skeleton className="h-[128px] rounded-lg" />
						</li>
					</ul>
				)}
				error={() => (
					<ErrorState
						title="Error fetching spaces"
						description={"Something went wrong while fetching spaces."}
						containerClassName="w-full"
					>
						<Button variant="outline" onClick={() => spacesQuery.refetch()}>
							Reload
						</Button>
					</ErrorState>
				)}
				empty={() => (
					<EmptyState title="No spaces created yet" description="You haven't created any spaces yet." containerClassName="w-full">
						<Button className="mt-6 gap-1" onClick={() => onOpen("create-space", { org })}>
							<Plus className="-ml-1 size-5 shrink-0" aria-hidden={true} />
							Create Space
						</Button>
					</EmptyState>
				)}
			/>
		</div>
	);
};
