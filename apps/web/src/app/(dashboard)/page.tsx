import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Organization } from "@prisma/client";
import type { NextPage } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const IndexPage: NextPage = async () => {
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

	if (organizations?.length === 0) {
		return redirect("/create");
	}

	return redirect(`/orgs/${organizations[0]?.slug}`);
};

export default IndexPage;
