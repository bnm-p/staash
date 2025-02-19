import type { FC } from "react";
import { OrgSwitchClient } from "./org-switch.client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Organization } from "@prisma/client";

export interface IOrgSwitchProps extends React.ComponentProps<"button"> {}

export const OrgSwitch: FC<IOrgSwitchProps> = async ({ ...props }) => {
	const session = await auth.api.getSession({ headers: await headers() });
	const usersMembers = await db.member.findMany({
		where: { userId: session?.user.id },
	});

	const organizations: Organization[] = [];

	for (const member of usersMembers) {
		const org = await db.organization.findUnique({
			where: { id: member.organizationId },
		});

		if (!org) continue;

		organizations.push(org);
	}

	return <OrgSwitchClient {...props} organizations={organizations} />;
};
