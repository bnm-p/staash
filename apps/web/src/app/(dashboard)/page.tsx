import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orgsService } from "@/queries/orgs.service";
import { usersService } from "@/queries/users.service";
import type { NextPage } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface IIndexPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const IndexPage: NextPage<IIndexPageProps> = async ({ searchParams }) => {
	const params = await searchParams;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) {
		return;
	}

	const dbUser = await db.user.findUnique({
		where: { id: session?.user.id },
	});

	if (dbUser?.lastActiveOrgId) {
		const org = await orgsService.getOrgById(dbUser?.lastActiveOrgId);
		return redirect(`/${org.slug}`);
	}

	const organizations = await usersService.getAllOrgsForCurrentUser(session?.user.id);

	if (params.modalOpen === "create-org") {
		return;
	}

	if (organizations?.length === 0) {
		return redirect("/?modalOpen=create-org");
	}
	return redirect(`/${organizations[0]?.slug}`);
};

export default IndexPage;
