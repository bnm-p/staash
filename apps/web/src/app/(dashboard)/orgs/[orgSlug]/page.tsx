import { SideNavLink } from "@/components/sidenav-link";
import type { NextPage } from "next";
import { Plus } from "lucide-react";
import { SpaceCard } from "@/components/space-card";
import type { Space } from "@prisma/client";
import { a } from "node_modules/better-auth/dist/auth-BBnJHOLM";
import { client } from "@/lib/client";
import { db } from "@/lib/db";
import { orgs } from "@/queries/orgs";

interface IOrgSlugPageProps {
	params: Promise<{ orgSlug: string }>;
}

const OrgSlugPage: NextPage<IOrgSlugPageProps> = async ({ params }) => {
	const { orgSlug } = await params;

	const org = await orgs.getOrgBySlug(orgSlug);

	const spaces = await db.space.findMany({
		where: { organizationId: org.id },
	});

	console.log(spaces);

	return (
		<div className="flex">
			<SideNavLink />

			<div className="w-full">
				<div className="border-border border-b h-fit flex justify-end">
					<button type="button" className="flex h-full w-56 items-center gap-2 border-border border-l px-8 hover:bg-muted">
						<div className="flex items-center gap-2">
							<span className="p-2">Create Space</span>
						</div>
						<Plus className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</button>
				</div>

				<div className="grid grid-cols-2">
					{spaces.map((space: Space, index: number) => (
						<SpaceCard key={space.id} space={space} index={index} />
					))}
				</div>
			</div>
		</div>
	);
};

export default OrgSlugPage;
