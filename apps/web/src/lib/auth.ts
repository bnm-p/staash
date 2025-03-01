import { StashVerifyEmail } from "@workspace/transactional/emails/confirm-email";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, organization } from "better-auth/plugins";
import { db } from "./db";
import { resend } from "./resend";

export const auth = betterAuth({
	database: prismaAdapter(db, { provider: "postgresql" }),
	plugins: [
		organization(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				await resend.emails.send({
					from: "onboarding@staash.app",
					to: email,
					subject: "Staash - Verify your email",
					react: StashVerifyEmail({ validationCode: otp }),
				});
			},
		}),
	],
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
