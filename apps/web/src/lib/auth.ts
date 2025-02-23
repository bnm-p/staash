import { db } from "./db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, organization } from "better-auth/plugins";

export const auth = betterAuth({
	database: prismaAdapter(db, { provider: "postgresql" }),
	plugins: [organization()],
	user: {
		additionalFields: {
			lastActiveOrgId: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		async sendResetPassword(data, request) {
			// Send an email to the user with a link to reset their password
		},
	},
	appName: "Staash",
	socialProviders: {
		// google: {
		// 	clientId: process.env.GOOGLE_CLIENT_ID,
		// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		// },
		github: {
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		},
	},
});
