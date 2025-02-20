import { db } from "@/lib/db";
import type { NextPage } from "next";
import { notFound } from "next/navigation";

interface ISpaceSlugPageProps {
	params: Promise<{ orgSlug: string; spaceSlug: string }>;
}

const SpaceSlugPage: NextPage<ISpaceSlugPageProps> = async ({ params }) => {
	const { orgSlug, spaceSlug } = await params;

	const space = await db.space.findUnique({
		where: {
			slug: spaceSlug,
			organization: {
				slug: orgSlug,
			},
		},
	});

	if (!space) notFound();

	return (
		<>
			<section className="background-stripes animate | relative border-b border-border px-8 py-6">
				<div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
				<div className="space-y-1.5 relative z-10">
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
