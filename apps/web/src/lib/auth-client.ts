import { createAuthClient } from "better-auth/react";
import { emailOTPClient, organizationClient, twoFactorClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [organizationClient(), emailOTPClient()],
});

export { authClient };
export const { signIn, signOut, signUp, useSession } = authClient;
