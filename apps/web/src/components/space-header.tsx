import { db } from "@/lib/db";
import { orgsService } from "@/queries/orgs.service";
import type { FC } from "react";
import { SpaceHeaderClient } from "./space-header.client";

interface ISpaceHeaderProps extends React.ComponentProps<"div"> {
	orgSlug: string;
	spaceSlug: string;
}

export const SpaceHeader: FC<ISpaceHeaderProps> = async ({ className, orgSlug, spaceSlug, ...props }) => {
	const org = await orgsService.getOrgBySlug(orgSlug);

	if (!org) {
		console.log("[space-header.tsx] no org");
		return;
	}

	const space = await db.space.findUnique({
		where: {
			slug_organizationId: {
				slug: spaceSlug,
				organizationId: org.id,
			},
		},
	});

	if (!space) {
		console.log("[space-header.tsx] no space");
		return;
	}

	return <SpaceHeaderClient organization={org} space={space} {...props} />;
};
