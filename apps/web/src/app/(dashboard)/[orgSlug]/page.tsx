import { db } from "@/lib/db";
import { orgsService } from "@/queries/orgs.service";
import type { NextPage } from "next";
import { OrgSlugClientPage } from "./page.client";

interface IOrgSlugPageProps {
	params: Promise<{ orgSlug: string }>;
}

const OrgSlugPage: NextPage<IOrgSlugPageProps> = async ({ params }) => {
	const { orgSlug } = await params;

	const org = await orgsService.getOrgBySlug(orgSlug);

	const spaces = await db.space.findMany({
		where: { organizationId: org.id },
	});

	return <OrgSlugClientPage spaces={spaces} org={org} />;
};

export default OrgSlugPage;
