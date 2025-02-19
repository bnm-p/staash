import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [organizationClient()],
});

export { authClient };
export const { signIn, signOut, signUp, useSession } = authClient;
