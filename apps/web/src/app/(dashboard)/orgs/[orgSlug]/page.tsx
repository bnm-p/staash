import type { NextPage } from "next";

interface IOrgSlugPageProps {
	params: Promise<{ orgSlug: string }>;
}

const OrgSlugPage: NextPage<IOrgSlugPageProps> = async ({ params }) => {
	return <>org page</>;
};

export default OrgSlugPage;
