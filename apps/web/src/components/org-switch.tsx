import type { FC } from "react";
import { OrgSwitchClient } from "./org-switch.client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { usersService } from "@/queries/users.service";

export interface IOrgSwitchProps extends React.ComponentProps<"button"> {}

export const OrgSwitch: FC<IOrgSwitchProps> = async ({ ...props }) => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) {
		return;
	}

	const organizations = await usersService.getAllOrgsForCurrentUser(session?.user.id);

	return <OrgSwitchClient {...props} organizations={organizations} />;
};
