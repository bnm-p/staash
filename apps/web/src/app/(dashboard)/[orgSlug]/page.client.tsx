"use client";

import type { Organization, Space } from "@prisma/client";
import type { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { AlignJustify, CircleOff, Grid, LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useModal } from "@/hooks/use-modal";
import { Logo } from "@/components/icons";
import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";

interface IOrgSlugClientPageProps {
	org: Organization;
	spaces: Space[];
}

export const OrgSlugClientPage: NextPage<IOrgSlugClientPageProps> = ({ spaces, org }) => {
	const { onOpen } = useModal();

	const [search, setSearch] = useState("");
	const [view, setView] = useState<"grid" | "list">("list");
	const [sort, setSort] = useState<"newest" | "oldest" | "name" | "updated">("newest");

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
		<div className="space-y-6">
			<div className="flex justify-between">
				<p className="text-2xl">Spaces</p>
				<Button variant={"outline"} onClick={() => onOpen("create-space", { org })}>
					Create Space <Plus />
				</Button>
			</div>
			<div className="flex items-center gap-x-4">
				<div className="flex-grow">
					<Input type="text" placeholder="Search spaces..." value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>
				<div className="flex items-stretch">
					<Button
						variant={view === "grid" ? "default" : "outline"}
						className="rounded-r-none"
						onClick={() => {
							setView("grid");
						}}
					>
						<LayoutGrid />
					</Button>
					<Button
						variant={view === "list" ? "default" : "outline"}
						className="rounded-l-none border-l-none"
						onClick={() => {
							setView("list");
						}}
					>
						<AlignJustify />
					</Button>
				</div>
				<div>
					<Select defaultValue={sort} onValueChange={(value) => setSort(value as "newest" | "oldest" | "name" | "updated")}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest</SelectItem>
							<SelectItem value="oldest">Oldest</SelectItem>
							<SelectItem value="name">Name</SelectItem>
							<SelectItem value="updated">Updated</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
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
				<div className="space-y-2">
					{spacesQuery.data.map((space) => (
						<div key={space.id} className="rounded-md border bg-background px-6 py-3">
							<div className="flex items-center gap-x-2">
								<Logo name={space.icon} className="size-10" />
								<div>
									<p className="text-sm">{space.name}</p>
									<p className="text-muted-foreground text-xs">{space.slug}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
