import { ChangeOrgLogoCard } from "@/components/change-org-logo-card";
import { orgsService } from "@/queries/orgs.service";

import { SettingsDeleteCard } from "@/components/settings-delete-card";
import type { NextPage } from "next";
import { Cards } from "./cards";

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

				<div className="space-y-8 pl-3">
					<Cards org={org} />
					<ChangeOrgLogoCard organization={org} />
					<SettingsDeleteCard
						label="Delete Organization"
						description="This will delete your organization and all its spaces and data."
					/>
				</div>
			</div>
		</div>
	);
};

export default OrganizationSettingsPage;
