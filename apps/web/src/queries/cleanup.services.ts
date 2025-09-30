import { db } from "@/lib/db";

export const cleanupService = {
	cleanupPendingUsers: async () => {
		const cutoff = new Date(Date.now() - 30 * 60 * 1000);

		await db.user.deleteMany({
			where: {
				status: "pending",
				createdAt: { lt: cutoff },
			},
		});
	},
};
