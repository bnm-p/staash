import type { NextPage } from "next";
import { Client } from "./client";

interface IDemoPageProps {
	params: Promise<{ orgSlug: string; spaceSlug: string }>;
}

const DemoPage: NextPage<IDemoPageProps> = async ({ params }) => {
	const { orgSlug, spaceSlug } = await params;
	return (
		<>
			<Client orgSlug={orgSlug} spaceSlug={spaceSlug} />
		</>
	);
};

export default DemoPage;
