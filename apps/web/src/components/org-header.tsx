import { db } from "@/lib/db";
import type { FC } from "react";
import { OrgHeaderClient } from "./org-header.client";
import { headers } from "next/headers";

export interface IOrgHeaderProps extends React.ComponentProps<"div"> {
	orgSlug?: string;
	spaceSlug?: string;
}

export const OrgHeader: FC<IOrgHeaderProps> = async ({ className, orgSlug, spaceSlug, ...props }) => {
	const h = await headers();
	const pathname = h.get("x-path");

	const org = await db.organization.findUnique({
		where: { slug: orgSlug },
		include: { spaces: true },
	});

	if (!org) return <>404</>;

	const space = spaceSlug
		? await db.space.findUnique({
				where: {
					slug_organizationId: {
						slug: spaceSlug,
						organizationId: org.id,
					},
				},
			})
		: null;

	return <OrgHeaderClient {...props} organization={org} space={space} isCreate={pathname?.endsWith("/create")} />;
};
