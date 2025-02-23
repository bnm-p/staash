import type { NextPage } from "next";

interface ISpaceSlugPageProps {
	params: Promise<{ orgSlug: string; spaceSlug: string }>;
}

const SpaceSlugPage: NextPage<ISpaceSlugPageProps> = async ({ params }) => {
	const { orgSlug, spaceSlug } = await params;

	return (
		<div className="justify-center">
			space page: {orgSlug} {spaceSlug}
		</div>
	);
};

export default SpaceSlugPage;
