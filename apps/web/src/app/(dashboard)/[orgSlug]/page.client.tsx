"use client";

import { Space } from "@/components/space";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import { useModal } from "@/hooks/use-modal";
import { client } from "@/lib/client";
import type { Organization, Space as TSpace } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { AlignJustify, LayoutGrid, Plus } from "lucide-react";
import type { NextPage } from "next";
import { use, useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";

interface IOrgSlugClientPageProps {
	org: Organization;
	spacesPromise: Promise<TSpace[]>;
}

export const OrgSlugClientPage: NextPage<IOrgSlugClientPageProps> = ({ spacesPromise, org }) => {
	const { onOpen } = useModal();

	const spaces = use(spacesPromise);
	const list = useRef<HTMLUListElement>(null);

	const [search, setSearch] = useState("");
	const [view, setView] = useLocalStorageState<"grid" | "list">("spaces_view-list", "list");
	const [sort, setSort] = useLocalStorageState<"newest" | "oldest" | "name" | "updated">("spaces_view-sort", "newest");

	// biome-ignore lint/correctness/useExhaustiveDependencies: list dependency is necessary for auto-animate
	useEffect(() => {
		list.current && autoAnimate(list.current);
	}, [list]);

	const spacesQuery = useQuery<TSpace[]>({
		queryKey: ["org", org.slug, "spaces"],
		queryFn: async () => {
			const res = await client.api.orgs[":orgSlug"].spaces.$get({ param: { orgSlug: org.slug } });

			const data = await res.json();

			return data.map((space) => ({ ...space, createdAt: new Date(space.createdAt), updatedAt: new Date(space.updatedAt) }));
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
				<div className="relative">
					<ul className="mt-8 space-y-2">
						<li className="rounded-md bg-muted px-6 py-3">
							<div className="size-8" />
						</li>
						<li className="rounded-md bg-muted px-6 py-3">
							<div className="size-8" />
						</li>
						<li className="rounded-md bg-muted px-6 py-3">
							<div className="size-8" />
						</li>
						<li className="rounded-md bg-muted px-6 py-3">
							<div className="size-8" />
						</li>
					</ul>
					<div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-black py-12">
						<p className="font-medium">No spaces created yet</p>
						<p className="mt-2 text-muted-foreground text-sm">Create your first space to get started</p>
						<Button className="mt-6 gap-1" onClick={() => onOpen("create-space", { org })}>
							<Plus className="-ml-1 size-5 shrink-0" aria-hidden={true} />
							Create Space
						</Button>
					</div>
				</div>
			) : (
				<ul ref={list} className={cn("", view === "grid" ? "grid grid-cols-2 gap-4 md:grid-cols-3" : "space-y-4")}>
					{spacesQuery.data.map((space) => (
						<Space key={space.id} variant={view} org={org} space={space} />
					))}
				</ul>
			)}
		</div>
	);
};
