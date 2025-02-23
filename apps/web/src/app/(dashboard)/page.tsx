import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orgsService } from "@/queries/orgs.service";
import type { Organization } from "@prisma/client";
import type { NextPage } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const IndexPage: NextPage = async () => {
	//TODO entweder orgsService Fetch nehmen oder ois auslogern --> HF bingo
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) {
		return;
	}

	const organizations = await orgsService.getAllOrgsForCurrentUser(session?.user.id);

	if (organizations?.length === 0) {
		return redirect("/create");
	}

	return redirect(`/${organizations[0]?.slug}`);
};

export default IndexPage;
