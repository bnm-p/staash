import { orgsService } from "@/queries/orgs.service";
import type { NextPage } from "next";
import { OrgSlugClientPage } from "./page.client";

interface IOrgSlugPageProps {
	params: Promise<{ orgSlug: string }>;
}

const OrgSlugPage: NextPage<IOrgSlugPageProps> = async ({ params }) => {
	const { orgSlug } = await params;

	const orgPromise = orgsService.getOrgBySlug(orgSlug);

	return <OrgSlugClientPage orgPromise={orgPromise} />;
};

export default OrgSlugPage;
