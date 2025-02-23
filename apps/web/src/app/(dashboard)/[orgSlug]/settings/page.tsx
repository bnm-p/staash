import type { NextPage } from "next";

interface ISettingsPageProps {
	params: Promise<{ orgSlug: string }>;
}

const SettingsPage: NextPage<ISettingsPageProps> = async ({ params }) => {
	return <div className="justify-center">Settings: {(await params).orgSlug}</div>;
};

export default SettingsPage;
