import { db } from "@/lib/db";
import { orgs } from "@/queries/orgs";
import type { NextPage } from "next";
import { notFound } from "next/navigation";

interface ISpaceSlugPageProps {
	params: Promise<{ orgSlug: string; spaceSlug: string }>;
}

const SpaceSlugPage: NextPage<ISpaceSlugPageProps> = async ({ params }) => {
	const { orgSlug, spaceSlug } = await params;

	const org = await orgs.getOrgBySlug(orgSlug);

	const space = await db.space.findUnique({
		where: {
			slug_organizationId: {
				slug: spaceSlug,
				organizationId: org.id,
			},
		},
	});

	if (!space) notFound();

	return (
		<>
			<section className="background-stripes animate | relative border-border border-b px-8 py-6">
				<div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
				<div className="relative z-10 space-y-1.5">
					<h1>{space.name}</h1>
					<p className="text-muted-foreground">
						{orgSlug}/{spaceSlug}
					</p>
				</div>
			</section>
		</>
	);
};

export default SpaceSlugPage;
