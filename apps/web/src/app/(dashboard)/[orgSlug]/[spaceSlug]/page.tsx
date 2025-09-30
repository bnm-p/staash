import { orgsService } from "@/queries/orgs.service";
import { spacesService } from "@/queries/spaces.service";
import type { NextPage } from "next";
import { notFound } from "next/navigation";
import { SpaceSlugClientPage } from "./page.client";

interface ISpaceSlugPageProps {
	params: Promise<{ orgSlug: string; spaceSlug: string }>;
}

const SpaceSlugPage: NextPage<ISpaceSlugPageProps> = async ({ params }) => {
	const { orgSlug, spaceSlug } = await params;

	const org = await orgsService.getOrgBySlug(orgSlug);
	const space = await spacesService.getSpaceBySpaceSlugAndOrgSlug({spaceSlug, orgSlug});

	if (!space) {
		return notFound();
	}

	return <SpaceSlugClientPage org={org} space={space} />;
};

export default SpaceSlugPage;
