"use client";

import { client } from "@/lib/client";
import { Button } from "@workspace/ui/components/button";
import type { FC } from "react";

interface IClientProps {
	orgSlug: string;
	spaceSlug: string;
}

export const Client: FC<IClientProps> = ({ orgSlug, spaceSlug }) => {
	const deleteOrg = async () => {
		await client.api.orgs[":orgSlug"].$delete({ param: { orgSlug } });
	};
	return (
		<>
			<Button onClick={deleteOrg}>Mochma Org weg? Tmm</Button>
		</>
	);
};
