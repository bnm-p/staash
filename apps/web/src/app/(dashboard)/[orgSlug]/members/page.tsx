import type { NextPage } from "next";

interface IMembersPageProps {
	params: Promise<{ orgSlug: string }>;
}

const MembersPage: NextPage<IMembersPageProps> = async ({ params }) => {
	return <div className="justify-center">Members: {(await params).orgSlug}</div>;
};

export default MembersPage;
