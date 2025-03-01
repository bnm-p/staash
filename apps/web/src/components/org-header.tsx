import type { FC } from "react";
import { OrgHeaderClient } from "./org-header.client";
import { headers } from "next/headers";
import { orgsService } from "@/queries/orgs.service";

interface IOrgHeaderProps extends React.ComponentProps<"div"> {
	orgSlug: string;
}

export const OrgHeader: FC<IOrgHeaderProps> = async ({ className, orgSlug, ...props }) => {
	const h = await headers();
	const pathname = h.get("x-path");

	const org = await orgsService.getOrgBySlug(orgSlug);

	if (!org) return;

	return <OrgHeaderClient organization={org} isCreate={pathname?.endsWith("/create")} {...props} />;
};
