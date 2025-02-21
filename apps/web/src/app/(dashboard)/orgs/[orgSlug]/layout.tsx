import { OrgHeader } from "@/components/org-header";

interface IOrgLayoutProps {
	children: React.ReactNode;
	params: Promise<{ orgSlug: string; spaceSlug?: string }>;
}

export default async function OrgLayout({ children, params }: IOrgLayoutProps) {
	const { orgSlug, spaceSlug } = await params;

	return (
		<>
			<OrgHeader orgSlug={orgSlug} spaceSlug={spaceSlug} />
			{children}
		</>
	);
}
