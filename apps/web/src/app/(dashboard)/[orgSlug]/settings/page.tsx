import { ChangeOrgLogoCard } from "@/components/change-org-logo-card";
import { ImageUpload } from "@/components/ui/image-upload";
import { orgsService } from "@/queries/orgs.service";
import { Button } from "@workspace/ui/components/button";

import type { NextPage } from "next";

interface IOrganizationSettingsPageProps {
	params: Promise<{ orgSlug: string }>;
}

const OrganizationSettingsPage: NextPage<IOrganizationSettingsPageProps> = async ({ params }) => {
	const { orgSlug } = await params;
	const org = await orgsService.getOrgBySlug(orgSlug);

	return (
		<div className="flex">
			<div className="space-between w-full">
				<div className="w-full pl-3">
					<div className="space-y-3 pb-10">
						<div className="text-xl">General</div>
						<div className="text-muted-foreground">Basic information you'll share on your organization.</div>
					</div>
				</div>

				<div className="pl-3">
					<ChangeOrgLogoCard organization={org} />
				</div>
			</div>
		</div>
	);
};

export default OrganizationSettingsPage;
