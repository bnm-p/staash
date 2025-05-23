"use client";

import { authClient } from "@/lib/auth-client";
import { client } from "@/lib/client";
import type { Organization, Space } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FC } from "react";

interface IOrgSpaceSwitcherProps {
	className?: string;
}

export const OrgSpaceSwitcher: FC<IOrgSpaceSwitcherProps> = ({ className }) => {
	const params = useParams<{ orgSlug: string; spaceSlug?: string }>();
	const pathname = usePathname();
	const router = useRouter();

	const activeOrg = authClient.useActiveOrganization();
	const [spacesToShow, setSpacesToShow] = useState<Space[]>([]);
	const [activeSpace, setActiveSpace] = useState<Space | null>(null);

	const orgsQuery = useQuery<Organization[]>({
		queryKey: ["orgs"],
		queryFn: async () => {
			const res = await client.api.users.orgs.$get();
			const data = await res.json();

			return data.map((org) => ({
				...org,
				createdAt: new Date(org.createdAt),
			}));
		},
		enabled: !!params.orgSlug,
	});

	const spacesQuery = useQuery<Space[]>({
		queryKey: ["spaces"],
		queryFn: async () => {
			if (!orgsQuery.data?.length) return [];

			const spacesPromises = await Promise.all(
				orgsQuery.data.map(async (org) => {
					const res = await client.api.orgs[":orgSlug"].spaces.$get({ param: { orgSlug: org.slug } });
					const data = await res.json();

					return data.map((space) => ({
						...space,
						createdAt: new Date(space.createdAt),
						updatedAt: new Date(space.updatedAt),
					}));
				}),
			);

			return spacesPromises.flat();
		},
		enabled: !!orgsQuery.data?.length,
	});

	const handleOrgChange = useCallback(
		async (orgSlug: string) => {
			if (!orgSlug || (activeOrg && activeOrg?.data?.slug === orgSlug)) return;
			const res = await authClient.organization.setActive({ organizationSlug: orgSlug });
			setSpacesToShow(spacesQuery.data?.filter((space) => space.organizationId === res.data?.id) || []);
			router.push(`/${orgSlug}`);
		},
		[activeOrg, spacesQuery.data, router],
	);

	const handleSpacesToShowChange = useCallback(
		(orgId: string) => {
			console.log("handleSpacesToShowChange", orgId);

			setSpacesToShow(spacesQuery.data?.filter((space) => space.organizationId === orgId) || []);
		},
		[spacesQuery.data],
	);

	const handleSpaceChange = useCallback(
		(spaceSlug: string) => {
			const space = spacesQuery.data?.find((space) => space.slug === spaceSlug);
			if (!space) return;
			setActiveSpace(space);
			const orgSlug = orgsQuery.data?.find((org) => org.id === space.organizationId)?.slug;
			router.push(`/${orgSlug}/${spaceSlug}`);
		},
		[router, orgsQuery.data, spacesQuery.data],
	);

	useEffect(() => {
		handleOrgChange(params.orgSlug);
	}, [handleOrgChange, params.orgSlug]);

	useEffect(() => {
		if (!activeOrg?.data) return;
		setSpacesToShow(spacesQuery.data?.filter((space) => space.organizationId === activeOrg.data?.id) || []);
	}, [activeOrg, spacesQuery.data]);

	return (
		<div className="flex items-center gap-x-12">
			<div className="flex items-center gap-2">
				<Avatar className="size-6">
					<AvatarImage src={activeOrg?.data.logop || ""} alt={activeOrg?.name} />
					<AvatarFallback className="text-xs">{activeOrg?.name[0]}</AvatarFallback>
				</Avatar>
				<span className="text-sm">
					{activeOrganizationName}
					{selectedSpace ? ` / ${selectedSpace.name}` : ""}
				</span>
			</div>
			<div className="px-4 py-1 border flex gap-x-12">
				{orgsQuery.data?.map((org) => (
					<button
						type="button"
						key={org.slug}
						onClick={() => handleOrgChange(org.slug)}
						onMouseEnter={() => handleSpacesToShowChange(org.id)}
						onMouseLeave={() => handleSpacesToShowChange(activeOrg?.data?.id || "")}
					>
						{org.name}
						{activeOrg?.data?.slug === org.slug && <span className="ml-2 text-primary">✓</span>}
					</button>
				))}
			</div>
			<div className="px-4 py-1 border flex gap-x-12">
				{spacesToShow.map((space) => (
					<button type="button" key={space.slug} onClick={() => handleSpaceChange(space.slug)}>
						{space.name}
						{activeSpace?.slug === space.slug && <span className="ml-2 text-primary">✓</span>}
					</button>
				))}
			</div>
		</div>
	);
};
