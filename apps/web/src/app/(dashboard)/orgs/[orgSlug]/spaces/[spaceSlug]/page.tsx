import { SpaceHeader } from "@/components/space-header";
import type { NextPage } from "next";

interface ISpaceSlugPageProps {
	params: Promise<{ orgSlug: string; spaceSlug: string }>;
}

const SpaceSlugPage: NextPage<ISpaceSlugPageProps> = async ({ params }) => {
	const { orgSlug, spaceSlug } = await params;

	return (
		<>
			<SpaceHeader orgSlug={orgSlug} spaceSlug={spaceSlug} />
			space page
		</>
	);
};

export default SpaceSlugPage;
