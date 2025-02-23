import type { NextPage } from "next";

interface ISpaceSettingsPageProps {
	params: Promise<{ orgSlug: string; spaceSlug: string }>;
}

const SpaceSettingsPage: NextPage<ISpaceSettingsPageProps> = async ({ params }) => {
	const { orgSlug, spaceSlug } = await params;

	return (
		<div className="justify-center">
			space Settings: {orgSlug} {spaceSlug}
		</div>
	);
};

export default SpaceSettingsPage;
