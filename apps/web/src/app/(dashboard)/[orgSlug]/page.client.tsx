"use client";

import type { Organization, Space } from "@prisma/client";
import type { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { CircleOff, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useModal } from "@/hooks/use-modal";

interface IOrgSlugClientPageProps {
	org: Organization;
	spaces: Space[];
}

export const OrgSlugClientPage: NextPage<IOrgSlugClientPageProps> = ({ spaces, org }) => {
	const { onOpen } = useModal();

	const spacesQuery = useQuery<Space[]>({
		queryKey: ["spaces"],
		queryFn: async () => {
			const res = await client.api.orgs[":orgSlug"].spaces.$get({
				param: { orgSlug: org.slug },
			});

			const data = await res.json();

			return data.map((space) => ({ ...space, createdAt: new Date(space.createdAt) }));
		},
		initialData: spaces,
	});

	return (
		<>
			{spacesQuery.data.length === 0 ? (
				<div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-y-6 rounded-lg border border-border px-6 py-6">
					<div className="grid size-12 place-items-center rounded-md border border-border bg-muted">
						<CircleOff className="size-6 text-muted-foreground" />
					</div>
					<div className="space-y-2.5">
						<p className="text-center text-2xl">No spaces found</p>
						<p className="text-center text-muted-foreground">You have not created any spaces yet.</p>
					</div>
					<Button variant={"outline"} onClick={() => onOpen("create-space", { org })}>
						Create Space <Plus />
					</Button>
				</div>
			) : (
				spacesQuery.data.map((space) => <div key={space.id}>{space.name}</div>)
			)}
		</>
	);
};
