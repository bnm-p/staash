import type { FC } from "react";
import { UserProfileClient } from "./user-profile.client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface IUserProfileProps extends React.ComponentProps<"button"> {}

export const UserProfile: FC<IUserProfileProps> = async ({ ...props }) => {
	const session = await auth.api.getSession({ headers: await headers() });
	return <UserProfileClient {...props} user={session?.user} />;
};
