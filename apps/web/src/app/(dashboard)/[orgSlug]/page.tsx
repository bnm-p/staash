import type { NextPage } from "next";

interface IOrgSlugPageProps {
	params: Promise<{ orgSlug: string }>;
}

const OrgSlugPage: NextPage<IOrgSlugPageProps> = async ({ params }) => {
	const { orgSlug } = await params;

	return <></>;
};

export default OrgSlugPage;
